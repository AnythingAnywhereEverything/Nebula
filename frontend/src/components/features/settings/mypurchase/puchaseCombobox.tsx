import { Button, Combobox, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, Icon } from "@components/ui/NebulaUI";
import React from "react";
import { ProductVariant } from "src/types/product";
import s from "@styles/layouts/mypurchase.module.scss"
import Link from "next/link";

interface PurchaseHistory{
    orderID: string,
    
    productID:string,
    productName:string,
    
    storeID:string,
    storeName:string,

    amountPurchased: number,
    currency: string
    variantID: string
    sku: string
    price: number
    nsin: string
}
const PurchaseCombobox : React.FC = () => {


    return (
        <Field orientation={'horizontal'} className={s.productContainer}>
            <div className={s.imgContainer}>
                <img src="https://placehold.co/200" alt="" />
            </div>

            <Field orientation={'vertical'} >
                <Link href={'#'}>
                    <FieldGroup className={s.details}>
                        <Field orientation={'horizontal'}>
                            <Field className={s.nameContainer}>
                                <FieldLabel className={s.productName}>Nebula thingy item long nameeeeeeeeasdadsasdadaadasdadsadadadaseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</FieldLabel>
                            </Field>
                                <div  className={s.status}>
                                    <FieldLabel>Completed</FieldLabel>
                                </div>
                            </Field>
                        <FieldDescription>x2</FieldDescription>
                        <p>1200</p>
                    </FieldGroup>
                </Link>

                <Field orientation={'horizontal'}>
                    <Field orientation={'horizontal'} className={s.storeContainer}>
                        <h5>Nebula Store</h5>
                        <Button className={s.chatBtn}><Icon>󰍩</Icon>Chat</Button>
                        <Button className={s.viewStore}>View store</Button>
                    </Field>
                </Field>
                
            </Field>
        </Field>
    )
}

export default PurchaseCombobox;