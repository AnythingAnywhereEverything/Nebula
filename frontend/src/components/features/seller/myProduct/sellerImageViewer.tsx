import React from "react";
import s from "@styles/layouts/seller/myProduct.module.scss"

interface mediaViewer{
    mediaLists?: string[]
}

const SellerImageViewer:React.FC<mediaViewer> = ({mediaLists = []}) => {

    return(
        <div className={s.imgContainer}>
            {mediaLists.length > 1 ? (
                <img src={mediaLists[0]} alt="" />
            ) : (
                <img src="" alt="" />
            )}
        </div>
    )
}