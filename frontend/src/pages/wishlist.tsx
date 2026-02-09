import Head from "next/head";
import React from "react";
import s from "@styles/layouts/wishlist.module.scss"
import { Button, Field, FieldSeparator } from "@components/ui/NebulaUI";
import CartShopProduct from "@components/features/cart/cartShopProduct";
export default function Wishlist() {
        const hasItems = true;
    const selectedCount: number = 2;
    return(
        <>
            <Head>
                <title>Nebula Wishlist</title>
            </Head>

            <section className={s.wishlistPage}>

                <Field className={s.wishlistContainer}>
                    <Field className={s.header}>
                        <h1>Wishlist Page</h1>

                        <Field orientation={"horizontal"}>
                            {selectedCount === 0 ? (
                                <p>No item selected.</p>
                            ) : (
                                <p>{selectedCount} items selected.</p>
                            )}
                            
                        </Field>
                    </Field>

                    <FieldSeparator/>
                    
                    <Field className={s.wishlistItemContainer}>
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
                                        freeShipping amount={2} 
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
                                <div className={s.emptyWish}>
                                    <p>Your wishlist is empty.</p>
                                </div>
                            )}
                    </Field>
                    
                    {hasItems ? (
                        <>
                        <FieldSeparator />
                        <Field className={s.addItemContainer}>
                            <Field orientation={'horizontal'}>
                                
                                <Field orientation={'horizontal'}>
                                    <div className={s.selection}>
                                        <p>Selected item : 2</p>

                                        <Button variant={"ghost"} size={"sm"} className={s.selectAllBtn}>
                                            Select all items
                                        </Button>
                                    </div>
                                </Field>

                                <div className={s.addItem}>
                                    <p>
                                        Total item : 2
                                    </p>
                                    <Button>Add to cart</Button>        
                                </div>

                            </Field>
                        </Field>
                        </>
                    ) : (
                        <>
                        </>
                    )}

                </Field>
            </section>
        </>
    )
}