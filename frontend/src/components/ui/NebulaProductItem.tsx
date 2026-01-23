
import React from 'react';
import { NerdFonts } from '../utilities/NerdFonts';
import { ratingStars } from '@components/utilities/StarRating';
import style from '@styles/features/searchresult.module.scss';

type NebulaProductItemProps = {
    nsin: string;

    itemtag?: string;
    itemtagcolor?: string;

    itemtitle: string;
    itemimageurl: string;
    itemprice_usd: number;
    itemrating: number;
    productLocation: string;
}

const NebulaProductItem: React.FC<NebulaProductItemProps> = (props) => {
    const { 
        nsin, 
        itemtag, 
        itemtagcolor, 
        itemtitle, 
        itemimageurl, 
        itemprice_usd, 
        itemrating, 
        productLocation 
    } = props;
    return (
        <div className={style.searchResultItem}>
            <div className={style.imageContainer}>
                {itemtag &&
                    <p className={style.itemTag} style={{ backgroundColor: itemtagcolor }}>{itemtag}</p>
                }
                <img src={itemimageurl} alt="Item" className={style.itemImage} />
            </div>
            <div className={style.itemDetails}>
                <div className={style.topContent}>
                    <a className={style.itemTitle} 
                        title={itemtitle}
                        href={`/product/${nsin}/${encodeURIComponent(itemtitle)}`}>{itemtitle}</a>
                </div>
                <div className={style.bottomContent}>
                    <p className={style.itemPrice}>${itemprice_usd}</p>
                    <p className={style.itemRating}>
                        <NerdFonts>{ratingStars(itemrating)}</NerdFonts> {itemrating}
                    </p>
                    <p>
                        <NerdFonts></NerdFonts> {productLocation}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NebulaProductItem;