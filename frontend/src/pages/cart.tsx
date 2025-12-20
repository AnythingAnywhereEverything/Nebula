import React, { useState } from "react";
import style from '../styles/cart.module.scss';
import Link from "next/link";
import ItemCompo, { PriceDisplay } from '../components/layouts/bottomItemCompo';
import LoadingItemInCart from "@components/ui/ItemsInCart";

// Fetch all item in cart user
const itemInCart = 1;

function UsrCart ({item}: {item : number}) {
    if (item === 0){
        return (
            <div className={style.cartContainer}>
                <img src="" alt="" />
                <div className={style.fakeImg}></div>

                <div className={style.cartText}>
                    <h2>Your space is Empty</h2>
                    <Link href= "">Today's shop deal!</Link>
                </div>
                <div className={style.cartBottomShop}>
                </div>
            </div>
        )
    } else if (item >= 1){
        return (
            <div className={style.cartContainer}>
                {/* Item goes in there */}
                <LoadingItemInCart />
            </div>
        );
    }
}

export default function Cart() {
    return (
        <div className = {style.cartPage}>
            <div className={style.cartHeader}>
                <h2>Shopping Cart</h2>
                <h3>Customer service</h3>
            </div>
            <div>
                <p>{itemInCart} products in your class</p>
            </div>

            <div className={style.cartGrid}>
                {/* No item in cart COMPO */}
                <UsrCart item = {itemInCart} />

                <div className={style.cartOverall}>
                    <h2>Order Summary</h2>

                    <div className={style.cartSummary}>
                        <div className={style.summaryDetails}>
                            <p>Subtotal</p>
                            <PriceDisplay price={399.99} />
                        </div>

                        <div className={style.summaryDetails}>
                            <p>Discount</p>
                            {/* Need a function ? */}
                            <p>- ฿70</p>
                        </div>

                        <div className={style.summaryDetails}>
                            <p>Delivery</p>
                            {/* Need a function ? */}
                            <p>฿0</p>
                        </div>

                    </div>

                    <div className={style.cartTotal}>
                        <p>Total</p>
                        <summary>฿399</summary>
                    </div>

                    <div className={style.checkout}>
                        <button>Checkout</button>
                    </div>
                </div>

            </div>

            {/* Components go here */}
            <ItemCompo />
        </div>
    )
}