import React, { useState } from "react";
import style from '@styles/layouts/cart.module.scss';
import Link from "next/link";
import BottomProductContent from '@components/layouts/bottomProductContent';
import LoadingItemInCart from "@components/layouts/ItemsInCart";
import { NebulaButton } from "@components/ui/NebulaBtn";
import NebulaProductDisplay from "@components/ui/NebulaProductDisplay";
import CartShopContainer from "@components/features/cart/cartShopContainer";
import CartAllStore from "@components/features/cart/cartAllStoreProduct";

export default function Cart() {
    return (
        <section className = {style.cartPage}>

            <section className={style.cartSection}>
                <div className={style.productDisplay}>
                    
                    <CartAllStore />

                    <CartShopContainer
                    />

                </div>
                <div className={style.cartSummary}>
                    <section>
                        Summary
                    </section>
                </div>
            </section>

            <NebulaProductDisplay
            title="Recommended for you"
            type="display"
            max_rows={1}
            />
        </section>
    )
}