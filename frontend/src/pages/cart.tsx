import style from '@styles/layouts/cart.module.scss';
import Head from "next/head";
import CartShopProduct from "@components/features/cart/cartShopProduct";
import { RecommendPanel } from '@components/features/recommendation';

export default function Cart() {
    const hasItems = true; // later from backend
    const selectedCount: number = 2;

    return (
        <>
            <Head>
                <title>Nebula Shopping Cart</title>
            </Head>

            <section className={style.cartPage}>

                <section className={style.cartSection}>

                    <div className={style.cartContainer}>

                        <header className={style.header}>
                            <h1>Shopping Cart</h1>

                            <div className={style.headerAction}>
                                {selectedCount === 0 ? (
                                    <p>No item selected.</p>
                                ) : (
                                    <p>{selectedCount} items selected.</p>
                                )}

                                <button className={style.selectAllBtn}>
                                    Select all items
                                </button>
                            </div>
                        </header>

                        <div className={style.cartItemContainer}>
                            {hasItems ? (
                                <>
                                    <CartShopProduct 
                                        nsin="NB0000000001" 
                                        product_name="Something something, dont forget to make this into a link after implement product on the backend btw." 
                                        product_image="https://placehold.co/400" 
                                        price={299}
                                        variant={{color: "green", size: "L"}}
                                        checked
                                        availability={"in_stock"} 
                                        freeShipping amount={1} 
                                    /> 
                                    <CartShopProduct 
                                        nsin="NB0000000008"
                                        product_name="Something something Version 2 but make it veryyyy very longggggggggggggggggggg... NOT ENOUGH???????!?!? MAKE IT LONGERRRRRRRRRRRRRRRRRRRR LIKE THAT ONE VIDEO ON INSTAGRAM REELLLLLLLLLLLLLLLLLLLLLLLLL" 
                                        product_image="https://placehold.co/200" 
                                        price={1200} variant={{size: "L"}} 
                                        freeShipping availability={"in_stock"} 
                                        amount={1} 
                                    />
                                </>
                            ) : (
                                <div className={style.emptyCart}>
                                    <p>Your cart is empty.</p>
                                </div>
                            )}
                        </div>

                        <footer className={style.allTotal}>
                            <span>Total (2 items)</span>
                            <strong>$1,499</strong>
                        </footer>
                    </div>

                    <aside className={style.cartSummary}>
                        <section className={style.summaryBox}>
                            <h2>Order Summary</h2>

                            <div className={style.summaryRow}>
                                <span>Items</span>
                                <span>2</span>
                            </div>

                            <div className={style.summaryRow}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>

                            <div className={style.summaryTotal}>
                                <span>Total</span>
                                <strong>$1,499</strong>
                            </div>

                            <button className={style.checkoutBtn}>
                                Proceed to Checkout
                            </button>
                        </section>
                    </aside>

                </section>

                <RecommendPanel />

            </section>
        </>
    );
}
