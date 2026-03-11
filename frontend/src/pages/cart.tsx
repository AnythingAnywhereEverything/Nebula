import style from '@styles/layouts/cart.module.scss';
import Head from "next/head";
import CartShopProduct from "@components/features/cart/cartShopProduct";
import { RecommendPanel } from '@components/features/recommendation';
import { Button, Field, FieldGroup, FieldLegend, FieldSeparator, FieldSet, Separator } from '@components/ui/NebulaUI';
import { cn } from '@lib/utils';
import { useEffect, useState } from 'react';
import { GetCartItemsUsers, getCartItems } from '@/api/product';


export default function Cart() {
    const [cartItems, setCartItems] = useState<GetCartItemsUsers[]>();
    const [isChecked, setIsChecked] = useState<number>();
    const [currentPrice, setCurrentPrice] = useState<number>();

    async function checkPrice(data: GetCartItemsUsers[]) {
        let total = 0;

        for (const item of data) {
            if (item.is_selected) {
                const price = item.on_sale && item.sale_price
                    ? item.sale_price
                    : item.price;
                total += price * item.quantity;
            }
        }
        setCurrentPrice(total);
        console.log(currentPrice)
    }

    useEffect(() => {
        const fetchItem = async () => {
            try{
                const data = await getCartItems();
                setCartItems(data);

                const selectedCount = data.filter((item: any) => item?.is_selected === true).length;
                setIsChecked(selectedCount);
                checkPrice(data);
            } catch (e) {
                console.log(e)
            }
        }
        fetchItem();
    }, [])

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
                                {isChecked === 0 ? (
                                    <p>No item selected.</p>
                                ) : (
                                    <p>{isChecked} items selected.</p>
                                )}

                                <Button variant={"ghost"} size={"sm"} className={style.selectAllBtn}>
                                    Select all items
                                </Button>
                            </Field>
                        </Field>

                        <FieldSeparator/>

                        <FieldGroup className={style.cartItemContainer}>

                            {cartItems === undefined ? (
                                <p>Loading item...</p>
                            ) : cartItems.length === 0 ? (
                                <div className={style.emptyCart}>
                                    <p>Your cart is empty.</p>
                                </div>
                            ) : (
                                cartItems.map((item) => {
                                    if (!item.product_variants_id) return null;
                                
                                    return (
                                        <CartShopProduct
                                            key={item.product_variants_id}
                                            product_id={item.product_id}
                                            product_variants_id={item.product_variants_id}
                                            name={item.name}
                                            price={item.price}
                                            quantity={item.quantity}
                                            on_sale={item.on_sale}
                                            sale_price={item.sale_price ?? null}
                                            free_shipping={item.free_shipping}
                                            stock_quantity={item.stock_quantity ?? 0}
                                            image_url={item.image_url ? `${item.image_url}` : null}
                                            product_variants={item.product_variants ?? []}
                                            is_enable={item.is_enabled}
                                            is_selected={item.is_selected}
                                        />
                                    );
                                })
                            )}
                        </FieldGroup>
                        <Separator />
                        <footer className={style.allTotal}>
                            <span>Total ({cartItems?.length})</span>
                            <strong>${currentPrice}</strong>
                        </footer>
                    </FieldGroup>
                    <FieldSeparator />
                    <FieldGroup className={cn(style.cartSummary, style.cartContainer)}>
                        <Field className={style.summaryBox}>
                            <FieldLegend>Order Summary</FieldLegend>

                            <Field orientation={"horizontal"} style={{justifyContent:"space-between"}}>
                                <span>Items</span>
                                <span>{isChecked}</span>
                            </Field>

                            <Field orientation={"horizontal"} style={{justifyContent:"space-between"}}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </Field>

                            <Field orientation={"horizontal"} style={{justifyContent:"space-between"}}>
                                <span>Total</span>
                                <strong>$ {Intl.NumberFormat().format(currentPrice ?? 0)}</strong>
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
