import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import { NerdFonts } from '@components/utilities/NerdFonts';
import { ratingStars } from '@components/utilities/StarRating';
import { formatLargeNumber } from '@components/utilities/NormalizeNumber';
import { NebulaButton } from '@components/ui/NebulaBtn';

interface ProductMinorDetailProps {
    rating: number;
    review: number;
    sold: number;
}

const ProductMinorDetail: React.FC<ProductMinorDetailProps> = ({rating, review, sold}) => {
    

    return (
        <div className={style.productMinorDetail}>
            <div className={style.detailLeft}>
                <p>{rating} <NerdFonts>{ratingStars(rating)}</NerdFonts></p>
                <p title={review.toString()}>{formatLargeNumber(review)} Reviews</p>
                <p title={sold.toString()}>{formatLargeNumber(sold)} Sold</p>
            </div>
            <div className={style.detailRight}>
                <NebulaButton btnValues="Report" onClick={() => {}} />
            </div>
        </div>
    )

}

export default ProductMinorDetail;