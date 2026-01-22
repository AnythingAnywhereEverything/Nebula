import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import { NerdFonts } from '@components/utilities/NerdFonts';

interface ProductEssentialProps {
    shippingCost: number;
}

const ProductEssential: React.FC<ProductEssentialProps> = ({shippingCost}) => {
    

    return (
        <div className={style.essentialContainer}>
            <p className={style.essentialName}>Delivery</p>
            <div className={style.detail}>
                <NerdFonts extraClass={style.shipIcon}> </NerdFonts>
                {
                    shippingCost !== 0 ? (
                        <p>Total shipping cost ${shippingCost /* This is a placeholder, there will be no calculation on this project */}</p>
                    ) : (
                        <p>Free shipping</p>
                    )
                }
            </div>
        </div>
    )

}

export default ProductEssential;