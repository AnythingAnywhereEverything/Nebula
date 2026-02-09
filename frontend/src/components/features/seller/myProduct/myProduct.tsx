import { Button, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldLabel, FieldSeparator, Input } from "@components/ui/NebulaUI";
import s from "@styles/layouts/seller/myProduct.module.scss"
import React from "react";
import SellerProductComponent from "@components/features/seller/myProduct/productComponent";
interface getSku{
    sku: string[]
}
export default function MyProduct() {
    return (
        <>
            <Field className={s.myProductPage}>
                <Field className={s.myProductHeader}>
                    <h2>My Product</h2>
                </Field>

                <Field orientation={'horizontal'}
                className={s.myProductBar}>
                    <Button>Add New Product</Button>
                    <Button>Delete Product</Button>
                </Field>

                <Field className={s.myProductContainer}>
                    <Field orientation={'horizontal'}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>Sort by</Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    ASC
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    DSC
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    Price: low to high
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    Price: high to low
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    Out of stock
                                </DropdownMenuItem>
                            </DropdownMenuContent>

                        </DropdownMenu>
                        <Input type="text" placeholder="Search with Product name"/>
                    </Field>

                    <FieldSeparator/>

                    <Field className={s.productContainer}>
                        {/* COMPOENENT */}
                        <SellerProductComponent />
                        {/*  */}
                    </Field>
                </Field>
            </Field>
        </>
    )
}