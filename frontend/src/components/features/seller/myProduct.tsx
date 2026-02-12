import { Button, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldGroup, FieldLabel, FieldSeparator, Input } from "@components/ui/NebulaUI";
import s from "@styles/layouts/seller/myProduct.module.scss"
import React from "react";
import SellerProductComponent from "@components/features/seller/myProduct/productComponent";
interface getSku{
    sku: string[]
}
export default function MyProduct() {
    return (
        <FieldGroup className={s.myProductPage}>
            <h2>Shop Products</h2>

            <Field className={s.myProductContainer}>
                <Field orientation={'horizontal'}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"sm"}>Sort by</Button>
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
        </FieldGroup>
    )
}