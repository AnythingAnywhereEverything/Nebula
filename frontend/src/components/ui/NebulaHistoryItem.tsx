import React from "react"
import style from "@styles/ui/historyProduct.module.scss"
import productStyle from "@styles/features/searchresult.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";
import { ratingStars } from "@components/utilities/StarRating";
import { NebulaButton } from "./NebulaBtn";

type HistoryItemProps = {
    itemid: string;

    itemtitle: string;
    itemimageurl: string;
    itemprice_usd: number;
    itemrating: number;
}


const HistoryItem: React.FC<HistoryItemProps> = ({itemid, itemtitle, itemimageurl, itemprice_usd, itemrating}) => {
    const itemid_encoded = btoa(itemid).replace(/=+$/, '');
    
    return (
        <div className={productStyle.historyItem}>
            <div className={productStyle.imageContainer}>
                <img src={itemimageurl} alt="item" className={productStyle.itemImage} />
            </div>
            <div className={productStyle.itemDetails}>
                <div className={productStyle.topContent}>
                    <a className={productStyle.itemTitle}
                    title={itemtitle} 
                    // href={`/product/${encodeURIComponent(itemtitle)}/q/${itemid_encoded}`}>
                    href="#">
                    {itemtitle}</a>
                </div>
                <div className={productStyle.bottomContent}>
                    <p className={productStyle.itemPrice}>{itemprice_usd}$</p>
                    <p className={productStyle.itemRating}>
                        <NerdFonts>{ratingStars(itemrating)}</NerdFonts>
                    </p>
                </div>
            </div>

            <div className={style.deleteHistory}>
                <NebulaButton
                btnValues = "Remove from view"
                className={style.removeButton}
                onClick={() => {
                    console.log("Hello")
                }}
                />
            </div>
        </div>
    )
}

export default HistoryItem;