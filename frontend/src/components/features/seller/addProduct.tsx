import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";
import { FieldDescription, Field, FieldLabel, Input, FieldGroup, DropdownMenu, DropdownMenuTrigger, Button, DropdownMenuContent, DropdownMenuItem } from "@components/ui/NebulaUI";
import Form from "next/form";
import React, { useState } from "react";

export default function AddNewProduct() {

    const [productItem, setProductItem] = useState (1); //max 20 variant
    const [productName, setProductName] = useState("")
    const [SKU, setSKU] = useState("")
    const [productVariant, setProductVariant] = useState('none')
    
    return(
        <SellerLayout>
            <SellerHeader>Add new product</SellerHeader>
            <SellerContent>
                <Form action={'#'}>
                    <Field>
                        <FieldGroup>
                            {/*  */}
                            <Field orientation={'horizontal'}>
                                <FieldLabel style={{whiteSpace: "nowrap"}}>Choice 1</FieldLabel>
                                <Field >
                                    <FieldLabel></FieldLabel>
                                </Field>
                            </Field>
                        </FieldGroup>
                    </Field>
                </Form>
            </SellerContent>
        </SellerLayout>
    )
}