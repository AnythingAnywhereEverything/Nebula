import style from '@styles/layouts/cart.module.scss';
import Head from "next/head";
import CartShopProduct from "@components/features/cart/cartShopProduct";
import { RecommendPanel } from '@components/features/recommendation';
import { Button, Field, FieldGroup, FieldLegend, FieldSeparator, FieldSet, Separator } from '@components/ui/NebulaUI';
import { cn } from '@lib/utils';

export default function Cart() {
    const hasItems = true; // later from backend
    const selectedCount: number = 2;

    return (
        <>
            <Head>
                <title>Nebula Shopping Cart</title>
            </Head>

            <section className={style.cartPage}>

                <Field orientation={"horizontal"} className={style.cartSection}>

                    <FieldGroup className={style.cartContainer}>
                        <Field className={style.header}>
                            <h1>Shopping Cart</h1>

                            <Field orientation={"horizontal"}>
                                {selectedCount === 0 ? (
                                    <p>No item selected.</p>
                                ) : (
                                    <p>{selectedCount} items selected.</p>
                                )}

                                <Button variant={"ghost"} size={"sm"} className={style.selectAllBtn}>
                                    Select all items
                                </Button>
                            </Field>
                        </Field>

                        <FieldSeparator/>

                        <FieldGroup className={style.cartItemContainer}>
                            {hasItems ? (
                                <>
                                    <CartShopProduct 
                                        nsin="NB00000001"
                                        stock={20}
                                        product_name="Something something, dont forget to make this into a link after implement product on the backend btw." 
                                        product_image="https://placehold.co/400" 
                                        price={299}
                                        variant={{color: "green", size: "L"}}
                                        checked
                                        availability={"in_stock"} 
                                        freeShipping amount={1} 
                                    /> 
                                    <CartShopProduct
                                        stock={3}
                                        nsin="NB00000002"
                                        product_name="Something something Version 2 but make it veryyyy very longggggggggggggggggggg... NOT ENOUGH???????!?!? MAKE IT LONGERRRRRRRRRRRRRRRRRRRR LIKE THAT ONE VIDEO ON INSTAGRAM REELLLLLLLLLLLLLLLLLLLLLLLLL" 
                                        product_image="https://placehold.co/200" 
                                        price={1200} variant={{size: "L"}} 
                                        freeShipping availability={"low_stock"} 
                                        amount={1} 
                                    />
                                </>
                            ) : (
                                <div className={style.emptyCart}>
                                    <p>Your cart is empty.</p>
                                </div>
                            )}
                        </FieldGroup>
                        <Separator />
                        <footer className={style.allTotal}>
                            <span>Total (2 items)</span>
                            <strong>$1,499</strong>
                        </footer>
                    </FieldGroup>
                    <FieldSeparator />
                    <FieldGroup className={cn(style.cartSummary, style.cartContainer)}>
                        <Field className={style.summaryBox}>
                            <FieldLegend>Order Summary</FieldLegend>

                            <Field orientation={"horizontal"} style={{justifyContent:"space-between"}}>
                                <span>Items</span>
                                <span>2</span>
                            </Field>

                            <Field orientation={"horizontal"} style={{justifyContent:"space-between"}}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </Field>

                            <Field orientation={"horizontal"} style={{justifyContent:"space-between"}}>
                                <span>Total</span>
                                <strong>$1,499</strong>
                            </Field>

                            <Button size={"sm"}>
                                Proceed to Checkout
                            </Button>
                        </Field>
                    </FieldGroup>

                </Field>

                <RecommendPanel />

            </section>
        </>
    );
}
