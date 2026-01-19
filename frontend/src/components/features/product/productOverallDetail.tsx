import React from 'react';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/layouts/productlayout.module.scss';
import { ratingStars } from '@components/utilities/StarRating';

type productOVAinfo = {
    productTitle: string,
    storeId: string,
    storeName: string,
    rating: number,
    soldAmount: number,
    productVarient: { varientTitle: string; varients: string[] }[]
}

const ProductOverall: React.FC<productOVAinfo> = (productOVAinfo) => {

    return (
        <div className={style.overallDetailContainer}>
            {/* Overall detail content goes here */}
            <h2 className={style.productTitle}>{productOVAinfo.productTitle}</h2>
            <a href={`/store/${productOVAinfo.storeId}`}>{productOVAinfo.storeName}</a>
            <p><NerdFonts>{ratingStars(productOVAinfo.rating)}</NerdFonts>{productOVAinfo.rating}</p>
        </div>
    )
}

export default ProductOverall;