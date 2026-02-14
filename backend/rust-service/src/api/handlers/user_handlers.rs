use crate::{
    api::{
        APIError,
        middleware::user_mw::AuthUser,
        version::{self, APIVersion},
    },
    application::{
        repository::user_repo,
        security::auth::AuthError,
        service::media_service::{AllowedMediaType, ImageTransform, MediaOptions},
        state::SharedState,
    },
    domain::models::user::{UserResponse, UserUpdate},
};
use axum::{
    Extension,
    Json,
    extract::{Multipart, Path, State},
    http::StatusCode,
    response::IntoResponse, // response::IntoResponse,
};
use serde::Deserialize;

// -----------------------
// GET
// -----------------------

pub async fn get_user_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;
    let user = user_repo::get_by_id(&mut tx, id).await?;

    Ok(Json(UserResponse::from(user)))
}

// ------------------------------------
// PATCH
// ------------------------------------

// Helper!!! YIPPEE
async fn update_user_field(
    version: String,
    id: i64,
    state: SharedState,
    update: UserUpdate,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;
    let updated_user = user_repo::update(&mut tx, update, id).await?;
    tx.commit().await?;

    Ok(Json(UserResponse::from(updated_user)))
}

#[derive(Deserialize)]
pub struct ChangeDisplayNameRequest {
    pub display_name: String,
}
#[derive(Deserialize)]
pub struct ChangeUsernameRequest {
    pub username: String,
}

pub async fn change_display_name(
    Extension(auth): Extension<AuthUser>,
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    Json(payload): Json<ChangeDisplayNameRequest>,
) -> Result<impl IntoResponse, APIError> {
    let update = UserUpdate {
        display_name: Some(payload.display_name),
        ..Default::default()
    };

    if auth.user_id != id {
        return Err(APIError::from(AuthError::MissingAppropriatePermission));
    }

    update_user_field(version, id, state, update).await
}

pub async fn change_username(
    Extension(auth): Extension<AuthUser>,
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    Json(payload): Json<ChangeUsernameRequest>,
) -> Result<impl IntoResponse, APIError> {
    let update = UserUpdate {
        username: Some(payload.username),
        ..Default::default()
    };

    if auth.user_id != id {
        return Err(APIError::from(AuthError::MissingAppropriatePermission));
    }

    update_user_field(version, id, state, update).await
}

pub async fn add_or_update_profile_handler(
    Extension(auth): Extension<AuthUser>,
    Path((_version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    let options = MediaOptions {
        folder: "profile".into(),
        max_size: 8 * 1024 * 1024, // 8MB, for profile picture
        allowed_types: vec![AllowedMediaType::Jpeg, AllowedMediaType::Png],
        image_transform: Some(ImageTransform::Crop {
            max_width: 512,
            max_height: 512,
            ratio: None,
        }),
    };

    if auth.user_id != id {
        return Err(APIError::from(AuthError::MissingAppropriatePermission));
    }

    let mut tx = state.db_pool.begin().await?;
    let user = user_repo::get_by_id(&mut tx, id).await?;

    let old_profile_path = user.profile_picture_url;

    let relative_path = state
        .media_service
        .save_media(multipart, options, old_profile_path)
        .await?;

    let user_image_path = UserUpdate {
        profile_picture_url: Some(relative_path.clone()),
        ..Default::default()
    };

    user_repo::update(&mut tx, user_image_path, id).await?;
    Ok((StatusCode::OK, relative_path))
}
