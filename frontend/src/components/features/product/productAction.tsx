import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import { NerdFonts } from '@components/utilities/NerdFonts';

interface ProductActionProps {
    nsin: string;
}

const ProductAction: React.FC<ProductActionProps> = ({nsin}) => {
    

    return (
        <div className={style.productAction}>
            <button className={style.addToCart}>
                <NerdFonts></NerdFonts>
                Add to cart
            </button>

            <button className={style.buyNow}>
                Buy Now
            </button>

            <button className={style.wishList}>
                <NerdFonts></NerdFonts>
                Add to wishlist
            </button>
        </div>
    )

}

export default ProductAction;