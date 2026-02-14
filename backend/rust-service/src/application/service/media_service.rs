use std::path::PathBuf;

use axum::extract::{multipart::MultipartError, Multipart};
use hyper::StatusCode;
use infer;
use libvips::{ops, VipsImage};
use thiserror::Error;

use crate::{
    api::{APIError, APIErrorCode, APIErrorEntry, APIErrorKind},
    application::service::snowflake_service::{SnowflakeError, SnowflakeGenerator},
};

pub enum ImageTransform {
    Resize {
        max_width: i32,
        max_height: i32,
    },
    Crop {
        max_width: i32,
        max_height: i32,
        ratio: Option<(i32, i32)>,
    },
    None,
}

pub enum AllowedMediaType {
    Jpeg,
    Png,
    WebP,
    Mp4,
}

pub struct MediaOptions {
    pub folder: String,
    pub max_size: usize,
    pub allowed_types: Vec<AllowedMediaType>,
    pub image_transform: Option<ImageTransform>,
}

pub struct MediaService {
    media_root: String,
    snowflake: SnowflakeGenerator,
}

impl MediaService {
    pub fn new(media_root: String, snowflake: SnowflakeGenerator) -> Self {
        Self { media_root, snowflake }
    }

    pub async fn save_media(
        &self,
        mut multipart: Multipart,
        options: MediaOptions,
        old_relative_path: Option<String>,
    ) -> Result<String, MediaServiceError> {
        // Extract file
        let mut raw = None;

        while let Some(field) = multipart.next_field().await? {
            if field.name() == Some("file") {
                let bytes = field.bytes().await?;

                if bytes.len() > options.max_size {
                    return Err(MediaServiceError::SizeTooLarge);
                }

                raw = Some(bytes);
                break;
            }
        }

        let raw = raw.ok_or(MediaServiceError::MediaMissing)?;

        // Byte-level type detection
        let detected = infer::get(&raw)
            .ok_or(MediaServiceError::InvalidMediaType)?;

        let mime = detected.mime_type();

        let matched = options.allowed_types.iter().find(|allowed| {
            match allowed {
                AllowedMediaType::Jpeg => mime == "image/jpeg",
                AllowedMediaType::Png  => mime == "image/png",
                AllowedMediaType::WebP => mime == "image/webp",
                AllowedMediaType::Mp4  => mime == "video/mp4",
            }
        }).ok_or(MediaServiceError::InvalidMediaType)?;

        let (processed_bytes, extension) = match matched {
            AllowedMediaType::Jpeg |
            AllowedMediaType::Png  |
            AllowedMediaType::WebP => {

                let mut image = VipsImage::new_from_buffer(&raw, "")?;

                let mut width = image.get_width();
                let mut height = image.get_height();

                // Decompression bomb protection
                if width * height > 20_000_000 {
                    return Err(MediaServiceError::InvalidMediaType);
                }

                if let Some(transform) = options.image_transform {

                    match transform {

                        ImageTransform::Resize { max_width, max_height } => {
                            if width > max_width || height > max_height {
                                let scale = (max_width as f64 / width as f64)
                                    .min(max_height as f64 / height as f64);

                                image = ops::resize(&image, scale)?;
                            }
                        }

                        ImageTransform::Crop { max_width, max_height, ratio } => {
                            // Ratio Crop (if provided)
                            if let Some((rw, rh)) = ratio {

                                let target_ratio = rw as f64 / rh as f64;
                                let current_ratio = width as f64 / height as f64;

                                let (crop_width, crop_height) =
                                    if current_ratio > target_ratio {
                                        // Too wide
                                        let new_width = (height as f64 * target_ratio) as i32;
                                        (new_width, height)
                                    } else {
                                        // Too tall
                                        let new_height = (width as f64 / target_ratio) as i32;
                                        (width, new_height)
                                    };

                                let left = (width - crop_width) / 2;
                                let top  = (height - crop_height) / 2;

                                image = ops::extract_area(&image, left, top, crop_width, crop_height)?;
                                width = image.get_width();
                                height = image.get_height();
                            }

                            // Resize To Bounds
                            if width > max_width || height > max_height {
                                let scale = (max_width as f64 / width as f64)
                                    .min(max_height as f64 / height as f64);

                                image = ops::resize(&image, scale)?;
                            }
                        }

                        ImageTransform::None => {}
                    }
                }

                // Encode to WebP and strip metadata
                let webp = image.image_write_to_buffer(".webp[strip]")?;
                (webp, "webp")
            }

            // Video (pass-through)
            AllowedMediaType::Mp4 => {
                (raw.to_vec(), "mp4")
            }
        };

        let snowflake = self.snowflake.generate_id()?;
        let filename = format!("{}.{}", snowflake, extension);

        let mut dir = PathBuf::from(&self.media_root);
        dir.push(&options.folder);

        tokio::fs::create_dir_all(&dir).await?;

        let mut full_path = dir.clone();
        full_path.push(&filename);

        tokio::fs::write(&full_path, &processed_bytes).await?;

        // Delete old file
        if let Some(old) = old_relative_path {
            self.delete_old_file(&old).await;
        }

        let relative = PathBuf::from(&options.folder)
            .join(&filename)
            .to_string_lossy()
            .to_string();

        Ok(relative)
    }

    async fn delete_old_file(&self, relative_path: &str) {
        let mut full = PathBuf::from(&self.media_root);
        full.push(relative_path);

        if let Ok(root) = tokio::fs::canonicalize(&self.media_root).await {
            if let Ok(file) = tokio::fs::canonicalize(&full).await {
                if file.starts_with(&root) {
                    let _ = tokio::fs::remove_file(file).await;
                }
            }
        }
    }
}

#[derive(Debug, Error)]
pub enum MediaServiceError {
    #[error("libvips error")]
    LibVipError(#[from] libvips::error::Error),

    #[error("io error")]
    StdError(#[from] std::io::Error),

    #[error("invalid media type")]
    InvalidMediaType,

    #[error("media missing")]
    MediaMissing,

    #[error("media too large")]
    SizeTooLarge,

    #[error("multipart error")]
    MultipartError(#[from] MultipartError),

    #[error("snowflake error")]
    SnowflakeError(#[from] SnowflakeError),
}

impl From<MediaServiceError> for APIError {
    fn from(media_error: MediaServiceError) -> Self {
        let error = APIErrorEntry::new(&media_error.to_string())
            .code(APIErrorCode::SystemError)
            .kind(APIErrorKind::SystemError);

        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
            errors: vec![error],
        }
    }
}