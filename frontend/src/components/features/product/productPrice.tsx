import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';

interface ProductPriceProps {
    price: number;
    discount?: number;
}

const ProductPrice: React.FC<ProductPriceProps> = ({price, discount}) => {
    

    return (
        <div className={`${style.productPrice} ${price ? style.discounted : ""}`}>
            {discount ? (
                <>
                    <p><span className={style.percent}>–{Math.round((1 - discount / price) * 100)}%</span> ${discount}</p>
                    <s>${price}</s>
                </>
            ) : (
                <p className={style.priceFocus}>${price}</p>
            )}
        </div>
    )

}

export default ProductPrice;