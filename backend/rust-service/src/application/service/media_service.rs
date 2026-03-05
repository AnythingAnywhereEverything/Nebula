use std::path::PathBuf;

use axum::extract::Multipart;
use infer;
use libvips::{VipsImage, ops};
use serde::de::DeserializeOwned;

use crate::application::service::{
    errors::MediaServiceError, snowflake_service::SnowflakeGenerator,
};

pub struct ExtractedPayload<T> {
    pub payload: T,
    pub files: Vec<Vec<u8>>
}


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
        Self {
            media_root,
            snowflake,
        }
    }

    pub async fn extract_payload_with_type<T: DeserializeOwned> (
        mut multipart: Multipart,
        file_max_size: usize
    ) -> Result<ExtractedPayload<T>, MediaServiceError> {
        let mut files = Vec::new();
        let mut payload: Option<T> = None;

        while let Some(field) = multipart.next_field().await? {
            let name = field.name().unwrap_or("").to_string();

            match name.as_str() {
                "payload" => {
                    let raw = field.text().await
                        .map_err(|_| MediaServiceError::UnableToExtract)?;

                    payload = Some(
                        serde_json::from_str(&raw)
                            .map_err(|_| MediaServiceError::UnableToExtract)?
                    );
                }

                _ => {
                    let bytes = field.bytes().await?;
    
                    if bytes.len() > file_max_size {
                        return Err(MediaServiceError::SizeTooLarge);
                    }
    
                    files.push(bytes.to_vec());
                }
            }
        }

        let payload = payload.ok_or(MediaServiceError::UnableToExtract)?;

        let extracted = ExtractedPayload {
            payload,
            files,
        };
        Ok(extracted)
    }

    pub async fn extract_multipart_bytes(
        &self,
        mut multipart: Multipart,
        field_filter: Option<&str>,
        max_size: usize,
    ) -> Result<Vec<Vec<u8>>, MediaServiceError> {
        let mut files = Vec::new();

        while let Some(field) = multipart.next_field().await? {
            let name = field.name().unwrap_or("");

            if let Some(filter) = field_filter {
                if name != filter {
                    continue;
                }
            }

            let bytes = field.bytes().await?;

            if bytes.len() > max_size {
                return Err(MediaServiceError::SizeTooLarge);
            }

            files.push(bytes.to_vec());
        }

        if files.is_empty() {
            return Err(MediaServiceError::MediaMissing);
        }

        Ok(files)
    }

    pub async fn save_media(
        &self,
        raw: &[u8],
        options: MediaOptions,
        old_relative_path: Option<String>,
    ) -> Result<String, MediaServiceError> {
        if raw.len() > options.max_size {
            return Err(MediaServiceError::SizeTooLarge);
        }

        // Byte-level type detection
        let detected = infer::get(&raw).ok_or(MediaServiceError::InvalidMediaType)?;

        let mime = detected.mime_type();

        let matched = options
            .allowed_types
            .iter()
            .find(|allowed| match allowed {
                AllowedMediaType::Jpeg => mime == "image/jpeg",
                AllowedMediaType::Png => mime == "image/png",
                AllowedMediaType::WebP => mime == "image/webp",
                AllowedMediaType::Mp4 => mime == "video/mp4",
            })
            .ok_or(MediaServiceError::InvalidMediaType)?;

        let (processed_bytes, extension) = match matched {
            AllowedMediaType::Jpeg | AllowedMediaType::Png | AllowedMediaType::WebP => {
                let mut image = VipsImage::new_from_buffer(&raw, "")?;

                let mut width = image.get_width();
                let mut height = image.get_height();

                // Decompression bomb protection
                let pixels = width as i64 * height as i64;
                if pixels > 25_000_000 {
                    return Err(MediaServiceError::InvalidMediaType);
                }

                if let Some(transform) = options.image_transform {
                    match transform {
                        ImageTransform::Resize {
                            max_width,
                            max_height,
                        } => {
                            if width > max_width || height > max_height {
                                let scale = (max_width as f64 / width as f64)
                                    .min(max_height as f64 / height as f64);

                                image = ops::resize(&image, scale)?;
                            }
                        }

                        ImageTransform::Crop {
                            max_width,
                            max_height,
                            ratio,
                        } => {
                            // Ratio Crop (if provided)
                            if let Some((rw, rh)) = ratio {
                                let target_ratio = rw as f64 / rh as f64;
                                let current_ratio = width as f64 / height as f64;

                                let (crop_width, crop_height) = if current_ratio > target_ratio {
                                    // Too wide
                                    let new_width = (height as f64 * target_ratio) as i32;
                                    (new_width, height)
                                } else {
                                    // Too tall
                                    let new_height = (width as f64 / target_ratio) as i32;
                                    (width, new_height)
                                };

                                let left = (width - crop_width) / 2;
                                let top = (height - crop_height) / 2;

                                image =
                                    ops::extract_area(&image, left, top, crop_width, crop_height)?;
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
            AllowedMediaType::Mp4 => (raw.to_vec(), "mp4"),
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
