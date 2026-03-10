
//* this file is for separate the hell and the heaven */

use sqlx::{Postgres, Transaction};

use crate::{application::{repository::RepositoryResult}, domain::models::search::TypingQueryProduct};

pub async fn query_product_names(
    tx: &mut Transaction<'_, Postgres>,
    query: String
) -> RepositoryResult<Vec<TypingQueryProduct>> {
    let result = sqlx::query_as::<_, TypingQueryProduct>(
        r#"
        SELECT
            id::text as id,
            name,
            shop_id::text as shop_id 
        FROM products
        WHERE
            deleted_at IS NULL
            AND is_active = true
            AND name ILIKE '%' || $1 || '%'
        ORDER BY sold DESC
        LIMIT 20;
        "#
    )
    .bind(query)
    .fetch_all(tx.as_mut())
    .await?;

    Ok(result)
}
