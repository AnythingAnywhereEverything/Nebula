use crate::{
    api::{
        APIError,
        middleware::user_mw::AuthUser,
        version::{self, APIVersion},
    },
    application::{
        repository::user_repo::{self, UserRepoError},
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
async fn update_user_field<F>(
    version: String,
    id: i64,
    state: SharedState,
    update: UserUpdate,
    map_error: F,
) -> Result<impl IntoResponse, APIError>
where
    F: Fn(sqlx::Error) -> APIError,
{
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let updated_user = match user_repo::update(&mut tx, update, id).await {
        Ok(user) => user,
        Err(e) => return Err(map_error(e)),
    };

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

    update_user_field(
        version,
        id,
        state,
        update,
        |_| APIError::from(UserRepoError::UserInternalServerError)
    ).await
}

pub async fn change_username(
    Extension(auth): Extension<AuthUser>,
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    Json(payload): Json<ChangeUsernameRequest>,
) -> Result<impl IntoResponse, APIError> {
    if auth.user_id != id {
        return Err(APIError::from(AuthError::MissingAppropriatePermission));
    }

    let username = payload.username.clone();

    let update = UserUpdate {
        username: Some(username.clone()),
        ..Default::default()
    };

    update_user_field(
        version,
        id,
        state,
        update,
        move |e| {
            if let sqlx::Error::Database(db_err) = &e {
                if db_err.code().as_deref() == Some("23505")
                    && db_err.constraint() == Some("users_username_key")
                {
                    return APIError::from(
                        UserRepoError::UsernameAlreadyTaken(username.clone()),
                    );
                }
            }
            APIError::from(UserRepoError::UserInternalServerError)
        },
    ).await
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

    let updated_user = user_repo::update(&mut tx, user_image_path, id).await?;

    tx.commit().await?;

    tracing::trace!("Uploaded profile to : /cdn/{0}", relative_path );

    Ok(Json(UserResponse::from(updated_user)))
}
