-- * reset shop review stats
UPDATE shops
SET
    review_amount = 0,
    rating = 0;

-- * recompute
UPDATE shops s
SET
    review_amount = agg.total_reviews,
    rating = agg.weighted_rating / agg.total_reviews,
    updated_at = NOW()
FROM (
    SELECT
        shop_id,
        SUM(review_amount) AS total_reviews,
        SUM(rating * review_amount) AS weighted_rating
    FROM products
    WHERE
        deleted_at IS NULL
        AND review_amount > 0
    GROUP BY shop_id
) agg
WHERE s.id = agg.shop_id;