use crate::{
    api::{
        APIError,
        middleware::user_mw::AuthUser,
        version::{self, APIVersion},
    },
    application::{
        repository::{address_repo, errors::UserRepoError, user_repo},
        security::auth::AuthError,
        service::{
            errors::UserServiceError,
            media_service::{AllowedMediaType, ImageTransform, MediaOptions},
        },
        state::SharedState,
    },
    domain::{
        models::{
            address::{AddressResponse, NewAddress},
            user::{UserResponse, UserUpdate},
        },
        user::{phone_number::PhoneNumber, username::Username},
    },
};
use axum::{
    Extension, Json, extract::{Multipart, Path, State}, response::IntoResponse // response::IntoResponse,
};
use serde::Deserialize;

// TODO: Add permission checks for each handler, e.g., only allow users to update their own profile, or require admin permissions for certain actions. This can be done by checking the AuthUser information in the Extension and comparing it with the user ID in the path parameters.
// * The user permission will be handle with permission service in the future
// * For now, we will just check if the user is authenticated and if the user ID in the path matches the authenticated user's ID for certain actions like updating profile or adding addresses.
// * While some handler doesnt have user_id checked, it is because they are not implemented yet. We will add the permission checks when we implement those handlers.

// -----------------------
// DTOs
// -----------------------

#[derive(Deserialize)]
pub struct ChangeDisplayNameRequest {
    pub display_name: String,
}
#[derive(Deserialize)]
pub struct ChangeUsernameRequest {
    pub username: String,
}

#[derive(Deserialize)]
pub struct AddressRequest {
    pub full_name: String,
    pub address_line1: String,
    pub address_line2: String,
    pub city: String,
    pub country: String,
    pub state: String,
    pub zip_code: String,
    pub phone_number: String,
    pub is_default: bool,
}

#[derive(Deserialize)]
pub struct UpdateAddressRequest {
    pub full_name: String,
    pub address_line1: String,
    pub address_line2: String,
    pub city: String,
    pub country: String,
    pub state: String,
    pub zip_code: String,
    pub phone_number: String,
    pub is_default: bool,
}


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

    update_user_field(version, id, state, update, |_| {
        UserServiceError::from(UserRepoError::UserInternalServerError).into()
    })
    .await
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

    let username = Username::new(&payload.username).map_err(UserServiceError::from)?;

    let update = UserUpdate {
        username: Some(username.as_str().to_string()),
        ..Default::default()
    };

    update_user_field(version, id, state, update, move |e| {
        if let sqlx::Error::Database(db_err) = &e {
            if db_err.code().as_deref() == Some("23505")
                && db_err.constraint() == Some("users_username_key")
            {
                return UserServiceError::from(UserRepoError::UsernameAlreadyTaken(
                    username.as_str().to_string(),
                ))
                .into();
            }
        }
        UserServiceError::from(UserRepoError::UserInternalServerError).into()
    })
    .await
}

pub async fn add_or_update_profile_handler(
    Extension(auth): Extension<AuthUser>,
    Path((_version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    multipart: Multipart,
) -> Result<impl IntoResponse, APIError> {
    //extension -> auth

    let options = MediaOptions {
        folder: "profile".into(),
        max_size: 8 * 1024 * 1024, // 8MB, for profile picture
        allowed_types: vec![AllowedMediaType::Jpeg, AllowedMediaType::Png],
        image_transform: Some(ImageTransform::Crop {
            max_width: 512,
            max_height: 512,
            ratio: Some((1, 1)),
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

    tracing::trace!("Uploaded profile to : /cdn/{0}", relative_path);

    Ok(Json(UserResponse::from(updated_user)))
}

pub async fn add_user_address_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
    Json(payload): Json<AddressRequest>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let address_id = state.snowflake_generator.generate_id()?;

    let phone_number = PhoneNumber::new(&payload.phone_number)?;

    let address_input = NewAddress {
        id: address_id,
        user_id: id,
        address_line1: payload.address_line1,
        address_line2: Some(payload.address_line2),
        full_name: payload.full_name,
        city: payload.city,
        country: payload.country,
        state: payload.state,
        zip_code: payload.zip_code,
        phone_number: phone_number.as_str().to_string(),
        is_default: payload.is_default
    };

    let mut tx = state.db_pool.begin().await?;

    let mut address = address_repo::add(&mut tx, address_input).await?;

    if payload.is_default {
        address_repo::update_default_address(&mut tx, id, payload.is_default, address.clone()).await?;
    }

    tx.commit().await?;

    address.is_default = Some(payload.is_default);

    Ok(Json(AddressResponse::from(address)))
}

pub async fn update_user_address_handler(
    Path((version, id, address_id)): Path<(String, i64, i64)>,
    State(state): State<SharedState>,
    Json(payload): Json<UpdateAddressRequest>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let phone_number = PhoneNumber::new(&payload.phone_number)?;

    let address_input = NewAddress {
        id: address_id,
        user_id: id,
        address_line1: payload.address_line1,
        address_line2: Some(payload.address_line2),
        full_name: payload.full_name,
        city: payload.city,
        country: payload.country,
        state: payload.state,
        zip_code: payload.zip_code,
        phone_number: phone_number.as_str().to_string(),
        is_default: payload.is_default
    };

    let mut address = address_repo::update(&mut tx, address_id, id, address_input).await?;

    if payload.is_default {
        address_repo::update_default_address(&mut tx, id, payload.is_default, address.clone()).await?;
    }

    tx.commit().await?;

    address.is_default = Some(payload.is_default);


    Ok(Json(AddressResponse::from(address)))
}

pub async fn get_user_addresses_handler(
    Path((version, id)): Path<(String, i64)>,
    State(state): State<SharedState>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    let addresses = address_repo::get_by_user_id(&mut tx, id).await?;

    let addresses: Vec<AddressResponse> = addresses.into_iter().map(|addr| {
        AddressResponse::from(addr)
    }).collect();

    Ok(Json(addresses))
}

pub async fn delete_user_address_handler(
    Path((version, id, address_id)): Path<(String, i64, i64)>,
    State(state): State<SharedState>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    address_repo::delete(&mut tx, address_id, id).await?;

    tx.commit().await?;

    Ok(())
}

pub async fn set_default_address_handler(
    Path((version, id, address_id)): Path<(String, i64, i64)>,
    State(state): State<SharedState>,
) -> Result<impl IntoResponse, APIError> {
    let api_version: APIVersion = version::parse_version(&version)?;
    tracing::trace!("api version: {}", api_version);

    let mut tx = state.db_pool.begin().await?;

    address_repo::set_default_address_id(&mut tx, id, Some(address_id)).await?;

    tx.commit().await?;

    Ok(())
}