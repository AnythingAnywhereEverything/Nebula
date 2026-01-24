import React, { ReactNode, useState } from "react";
import { Product } from "src/types/product";
import style from '@styles/ui/cart/cartShopContainer.module.scss'
import { productExample } from "src/mocks/product.mock";
import Link from "next/link";

interface GetShopContainer {
    id: string
    productStoreId: string
    productStoreName: string
}

const CartShopContainer: React.FC<GetShopContainer> = ({}) => {
    const product = productExample;
    
    const [isChecked, setIsChecked] = useState(false);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    return(
        <section className={style.cartShopContainer}>
            <div className={style.cartShopHeader}>
                <div className={style.shopName}>
                    <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                     />
                    <Link href={`/store/${product.productStoreID}`}>
                    <span className={style.sellerPrefered}>Prefered</span>
                    {product.productStoreName}
                    </Link>
                </div>

                <div className={style.cartProduct}>
                    
                </div>
            </div>
        </section>
    );
}

export default CartShopContainer;