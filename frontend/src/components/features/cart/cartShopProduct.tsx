import React from "react";
import s from '@styles/layouts/cart.module.scss';
import { Button, ButtonGroup, Checkbox, Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, Icon, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@components/ui/NebulaUI";
import Link from "next/link";

interface ProductInCart {
    nsin: string;
    product_name: string;
    product_image: string;
    variant: Record<string, string>;
    availability: "in_stock" | "out_of_stock" | "low_stock";
    amount: number;
    price: number;
    checked?: boolean;
    stock: number;
    freeShipping?: boolean;
}

const CartShopProduct: React.FC<ProductInCart> = (prod)=>{
    const {
        nsin,
        product_name,
        product_image,
        variant,
        availability,
        stock,
        amount,
        checked,
        price,
        freeShipping,
    } = prod;

    const availabilityConfig = {
        in_stock: {
            text: (stock: number) =>  `${stock} left in stock`,
            className: s.inStock,
        },
        low_stock: {
            text: (stock: number) => `Only ${stock} left!`,
            className: s.lowStock,
        },
        out_of_stock: {
            text: "Out of stock",
            className: s.outOfStock,
        },
    } as const;

    const config = availabilityConfig[availability];

    return(
        <FieldLabel>
            <Field orientation="horizontal" className={s.itemSection}>
                <Field orientation={"horizontal"} style={{padding: "0"}}>
                    <Checkbox defaultChecked={checked} />
                    <div className={s.imageSection}>
                        <img src={product_image} alt="" />
                    </div>
                    <FieldSeparator/>
                    <Field className={s.productDetails} style={{padding: "0"}}>
                        <Field orientation={"horizontal"} style={{padding: "0"}}>
                            <FieldLegend className={s.productName}>
                                <Link href={`/product/${nsin}/a`}>{product_name}</Link>
                            </FieldLegend>
                            <div className={s.priceContainer}>
                                <p>
                                    {price}
                                </p>
                            </div>
                        </Field>
                        <span className={config.className}>
                            {typeof config.text === "function"
                            ? config.text(stock)
                            : config.text}
                        </span>
                        {
                            freeShipping && 
                            <p>Free Shipping</p>
                        }
                        <table className={s.variants}>
                            <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Val</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(variant).map(([key, val]) => (
                                    <tr className={s.variant} key={key}>
                                        <td className={s.key}>{key}</td>
                                        <td>{val}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <ButtonGroup>
                            <ButtonGroup>
                                <InputGroup style={{width:"calc(var(--spacing) * 32)"}}>
                                    <InputGroupAddon align="inline-start">
                                        <InputGroupButton size={"icon-xs"} onClick={() => {}}>
                                            <Icon></Icon>
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton size={"icon-xs"}  onClick={() => {}}>
                                            <Icon></Icon>
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        style={{textAlign:"center"}}
                                        type="text" min={1} defaultValue={amount}/>
                                </InputGroup>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button variant={"outline"} size={"sm"}>
                                    Save for later
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button variant={"outline"} size={"sm"}>
                                    Share
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button variant={"destructive"} size={"sm"}>
                                    Delete
                                </Button>
                            </ButtonGroup>
                        </ButtonGroup>
                    </Field>
                </Field>
                
            </Field>
        </FieldLabel>
    )
}

export default CartShopProduct