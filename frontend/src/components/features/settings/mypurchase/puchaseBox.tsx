import { Button, Combobox, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, Icon } from "@components/ui/NebulaUI";
import React from "react";
import { ProductVariant } from "src/types/product";
import s from "@styles/layouts/mypurchase.module.scss"
import Link from "next/link";
import { PurchaseItems } from "src/mocks/mypurchase.mock";

const PurchaseBox : React.FC = () => {

    const Purchased = PurchaseItems;

    return (
        <>
        {Purchased.map((item) => (
        <Field orientation={'horizontal'} className={s.productContainer}>

            <div className={s.imgContainer}>
                <img src={item.productImage} alt="" />
            </div>

            <Field orientation={'vertical'} >
                <Link href={`/product/${item.nsin}/${encodeURIComponent(item.productName)}`}>
                    <FieldGroup className={s.details}>
                        <Field orientation={'horizontal'}>
                            <Field className={s.nameContainer}>
                                <FieldLabel className={s.productName}>{item.productName}</FieldLabel>
                            </Field>
                                <div className={s.status}>
                                    <FieldLabel>{item.status}</FieldLabel>
                                </div>
                            </Field>
                        <FieldDescription>x{item.amountPurchased}</FieldDescription>
                        <p>${item.price}</p>
                    </FieldGroup>
                </Link>

                <Field orientation={'horizontal'}>
                    <Field orientation={'horizontal'} className={s.storeContainer}>
                        <Link href={`/store/${item.storeID}`}>
                            <h5>{item.storeName}</h5>
                        </Link>
                        <Button className={s.chatBtn}><Icon>󰍩</Icon>Chat</Button>
                        <Link href={`/store/${item.storeID}`}>
                            <Button className={s.viewStore}>View store</Button>
                        </Link>
                    </Field>
                </Field>
                
            </Field>
        </Field>
        ))}
    </>
    )
}

export default PurchaseBox;