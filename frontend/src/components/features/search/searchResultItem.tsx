
import React, { FC } from 'react';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/features/searchresult.module.scss';

type SearchResultItemProps = {
    itemid: string;
    itemtag?: string;
    itemtagcolor?: string;
    itemtitle: string;
    itemimageurl: string;
    itemprice_usd: number;
    itemrating: number;
    productLocation: string;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ itemid, itemtag, itemtagcolor, itemtitle, itemimageurl, itemprice_usd, itemrating, productLocation }) => {

    const ratingStars = () => {
        const stars = [];
        for (let i = 0; i < Math.floor(itemrating); i++) {
            stars.push("");
        }
        if (itemrating % 1 >= 0) {
            stars.push("");
        }
        for (let i = stars.length; i < 5; i++) {
            stars.push("");
        }
        return stars.join("");
    }
    // encode base 64 no pad the itemid for URL
    const itemid_encoded = btoa(itemid).replace(/=+$/, '');
    return (
        <div className={style.searchResultItem}>
            <div className={style.imageContainer}>
                <p className={style.itemTag} style={{ backgroundColor: itemtagcolor }}>{itemtag}</p>
                <img src={itemimageurl} alt="Item" className={style.itemImage} />
            </div>
            <div className={style.itemDetails}>
                <a className={style.itemTitle} title={itemtitle} href={`/product/${encodeURIComponent(itemtitle)}/q/${itemid_encoded}`}>{itemtitle}</a>
                <p className={style.itemPrice}>${itemprice_usd}</p>
                <div className={style.itemRating}>
                    <NerdFonts>{ratingStars()}</NerdFonts> {itemrating}
                </div>
            </div>
        </div>
    )
}

export default SearchResultItem;