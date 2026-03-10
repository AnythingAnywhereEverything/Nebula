use sqlx::{Postgres, Transaction};

use crate::{application::repository::RepositoryResult, domain::models::review::{ProductReplyRow, ProductReviewRow}};

pub async fn create_product_review(
    tx: &mut Transaction<'_, Postgres>,
    user_id: i64,
    id: i64, //* new id
    product_id: i64,
    content: String,
    rating: i32
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
        INSERT INTO product_reviews
        (
            id,
            product_id,
            user_id,
            rating,
            content
        )
        VALUES
        (
            $1,$2,$3,$4,$5
        )
        "#
    )
    .bind(id)
    .bind(product_id)
    .bind(user_id)
    .bind(rating)
    .bind(content)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn update_product_review(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64,
    rating: i32
) -> RepositoryResult<()> {
    let _ = sqlx::query(
        r#"
        UPDATE products
        SET
            rating = (
                (rating * review_amount + $1)::numeric
                /
                (review_amount + 1)
            ),
            review_amount = review_amount + 1,
            updated_at = NOW()
        WHERE id = $2
        "#
    )
    .bind(rating)
    .bind(product_id)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn create_review_reply(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    parent_id: i64,
    user_id: i64,
    product_id: i64,
    content: String
) -> RepositoryResult<()> {
    sqlx::query(
        r#"
        INSERT INTO product_reviews (
            id,
            product_id,
            parent_id,
            user_id,
            content
        )
        VALUES ($1, $2, $3, $4, $5)
        "#
    )
    .bind(id)
    .bind(product_id)
    .bind(parent_id)
    .bind(user_id)
    .bind(content)
    .execute(tx.as_mut())
    .await?;

    Ok(())
}

pub async fn query_product_reviews(
    tx: &mut Transaction<'_, Postgres>,
    product_id: i64,
    limit: i64,
    offset: i64,
    current_user_id: Option<i64>
) -> RepositoryResult<(Vec<ProductReviewRow>, bool)> {

    let mut rows = sqlx::query_as::<_, ProductReviewRow>(
    r#"
        SELECT
            pr.id::text as id,
            pr.user_id::text as user_id,

            u.display_name,
            u.profile_picture_url,

            pr.rating,
            pr.content,
            pr.likes,
            pr.dislikes,

            rr.reaction::text AS user_reaction,

            pr.created_at,
            pr.updated_at,

            COUNT(r.id) AS replies_count

        FROM product_reviews pr

        LEFT JOIN users u
            ON u.id = pr.user_id

        LEFT JOIN product_reviews r
            ON r.parent_id = pr.id
            AND r.deleted_at IS NULL

        LEFT JOIN review_reactions rr
            ON rr.review_id = pr.id
            AND rr.user_id = $4

        WHERE
            pr.product_id = $1
            AND pr.parent_id IS NULL
            AND pr.deleted_at IS NULL

        GROUP BY
            pr.id,
            u.display_name,
            u.profile_picture_url,
            rr.reaction

        ORDER BY pr.created_at DESC

        LIMIT $2
        OFFSET $3
        "#
    )
    .bind(product_id)
    .bind(limit + 1)
    .bind(offset)
    .bind(current_user_id)
    .fetch_all(tx.as_mut())
    .await?;

    let has_more = rows.len() as i64 > limit;

    if has_more {
        rows.pop();
    }

    Ok((rows, has_more))
}

pub async fn query_review_replies(
    tx: &mut Transaction<'_, Postgres>,
    review_id: i64,
    user_id: Option<i64>,
    limit: i64,
    offset: i64
) -> RepositoryResult<(Vec<ProductReplyRow>, bool)> {

    let rows: Vec<ProductReplyRow> = sqlx::query_as::<_, ProductReplyRow>(
        r#"
        SELECT
            pr.id::text as id,
            pr.user_id::text as user_id,

            u.profile_picture_url,
            u.display_name,
            pr.likes,
            pr.dislikes,
            pr.content,
            pr.created_at,
            pr.updated_at,
            rr.reaction::text AS user_reaction

        FROM product_reviews pr

        LEFT JOIN users u
            ON u.id = pr.user_id

        LEFT JOIN review_reactions rr
            ON rr.review_id = pr.id
            AND rr.user_id = $1

        WHERE
            pr.parent_id = $2
            AND pr.deleted_at IS NULL

        ORDER BY pr.created_at ASC

        LIMIT $3 + 1
        OFFSET $4
        "#
    )
    .bind(user_id)
    .bind(review_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(tx.as_mut())
    .await?;

    let has_more = rows.len() as i64 > limit;

    let replies = if has_more {
        rows.into_iter().take(limit as usize).collect()
    } else {
        rows
    };

    Ok((replies, has_more))
}

pub async fn react_to_review(
    tx: &mut Transaction<'_, Postgres>,
    id: i64,
    user_id: i64,
    review_id: i64,
    reaction: &str
) -> RepositoryResult<()> {

    let prev: Option<String> = sqlx::query_scalar(
        r#"
        SELECT reaction::text
        FROM review_reactions
        WHERE user_id = $1
        AND review_id = $2
        "#
    )
    .bind(user_id)
    .bind(review_id)
    .fetch_optional(tx.as_mut())
    .await?;

    let mut like_diff = 0;
    let mut dislike_diff = 0;

    match prev.as_deref() {
        Some("like") => like_diff -= 1,
        Some("dislike") => dislike_diff -= 1,
        _ => {}
    }

    match reaction {
        "like" => like_diff += 1,
        "dislike" => dislike_diff += 1,
        _ => {}
    }

    match prev {
        None => {
            sqlx::query(
                r#"
                INSERT INTO review_reactions (id, user_id, review_id, reaction)
                VALUES ($1,$2,$3,$4::reaction_type)
                "#
            )
            .bind(id)
            .bind(user_id)
            .bind(review_id)
            .bind(reaction)
            .execute(tx.as_mut())
            .await?;
        }
        Some(_) => {
            sqlx::query(
                r#"
                UPDATE review_reactions
                SET reaction = $1::reaction_type
                WHERE user_id = $2
                AND review_id = $3
                "#
            )
            .bind(reaction)
            .bind(user_id)
            .bind(review_id)
            .execute(tx.as_mut())
            .await?;
        }
    }

    if like_diff != 0 || dislike_diff != 0 {
        sqlx::query(
            r#"
            UPDATE product_reviews
            SET
                likes = likes + $1,
                dislikes = dislikes + $2
            WHERE id = $3
            "#
        )
        .bind(like_diff)
        .bind(dislike_diff)
        .bind(review_id)
        .execute(tx.as_mut())
        .await?;
    }

    Ok(())
}