import React, { useRef, useState } from "react";
import s from '@styles/layouts/cart.module.scss';
import { Button, ButtonGroup, Checkbox, Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, Icon, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@components/ui/NebulaUI";
import Link from "next/link";
import { AddToCartRequest, deleteCartItems, selectedCartItems, updateCartQuantity } from "@/api/product";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProductInCart {
    product_id: string;
    product_variants_id: string | null;
    name: string;
    price: number;
    quantity: number;
    on_sale: boolean;
    sale_price: number | null;
    free_shipping: boolean;
    stock_quantity: number;
    is_enable: boolean;
    is_selected:boolean;
    is_active:boolean;
    image_url: string | null;
    product_variants: { name: string; value: string }[];
}

type CartShopProductProps = ProductInCart & {
    onRefetch: () => void;
};

const CartShopProduct: React.FC<CartShopProductProps> = (prod)=>{
    const {
        product_id,
        product_variants_id,
        name,
        image_url,
        product_variants,
        stock_quantity,
        quantity,
        is_selected,
        is_enable,
        is_active,
        price,
        free_shipping,
        onRefetch
    } = prod;
    type AvailabilityKey = keyof typeof availabilityConfig;
    const router = useRouter();
    const getAvailabilityKey = (stock: number): AvailabilityKey => {
        if (stock <= 0) return "out_of_stock";
        if (stock <= 5) return "low_stock";
        return "in_stock";
    };

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

    const config = availabilityConfig[getAvailabilityKey(stock_quantity)];
    const [newQuantity, setNewQuantity] = useState<number>(quantity);

    const cooldownRef = useRef<NodeJS.Timeout | null>(null);

    async function onCheckedChange(
        product_id: string,
        product_variants_id: string,
        checked: boolean
    ) {
        const finalPayload = {
            product_id,
            product_variants_id,
            is_selected: checked
        };
    
        await selectedCartItems(finalPayload);
        onRefetch()
    }


    async function onQuantityChange(value: number, fromInput = false) {
    const next = Math.min(stock_quantity, value);
    if (!fromInput) {
        const finalValue = Math.max(1, next);
        setNewQuantity(finalValue);
        await sendUpdateCartRequest(finalValue);
        return;
    }
    setNewQuantity(next);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
      cooldownRef.current = setTimeout(async () => {
          const finalValue = next === 0 ? 1 : next;
          setNewQuantity(finalValue);
          await sendUpdateCartRequest(finalValue);
      }, 1000);
    }

    async function sendUpdateCartRequest (number: number) {

        if (product_variants_id === null) return; 
        const finalPayload: AddToCartRequest = {
            product_id: product_id,
            product_variants_id: product_variants_id,
            quantity: number
        }
        updateCartQuantity(finalPayload);
        onRefetch()
    }

    async function sendDeleteCartRequest () {

        if (product_variants_id === null) return; 
        const finalPayload: AddToCartRequest = {
            product_id: product_id,
            product_variants_id: product_variants_id,
            quantity: quantity
        }
        deleteCartItems(finalPayload);
        onRefetch()
    }
    

    return(
        <FieldLabel>
            <Field orientation="horizontal" 
            className={s.itemSection} 
            key={product_id}
            style={{ opacity: is_active ? 1 : 0.4 }}
            >
                <Field orientation={"horizontal"} style={{padding: "0"}}>
                    <Checkbox
                        disabled={!is_active}
                        defaultChecked={is_selected}
                        onCheckedChange={(checked: boolean) => {
                            if (!is_active) return;
                            if (!product_id || !product_variants_id) return;
                            onCheckedChange(product_id, product_variants_id, checked);
                        }}
                    />
                    <div className={s.imageSection}>
                        <Image
                            alt={name}
                            fill
                            src={image_url ? `/cdn/${image_url}` : `/default/placeholder.png`}
                        />
                    </div>
                    <FieldSeparator/>
                    <Field className={s.productDetails} style={{padding: "0"}}>
                        <Field orientation={"horizontal"} style={{padding: "0"}}>
                            <Field>
                                <FieldLegend className={s.productName}>
                                    <Link href={`/product/${product_variants_id}/a`}>{name}</Link>
                                </FieldLegend>
                            </Field>
                            <div className={s.priceContainer}>
                                <p>
                                    $ {price}
                                </p>
                            </div>
                        </Field>
                        <span className={config.className}>
                            {typeof config.text === "function"
                            ? config.text(stock_quantity)
                            : config.text}
                        </span>
                        {
                            free_shipping && 
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
                                {product_variants.map((variant) => (
                                    <tr className={s.variant} key={variant.name}>
                                        <td className={s.key}>{variant.name}</td>
                                        <td>{variant.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <ButtonGroup>
                            <ButtonGroup>
                                <InputGroup style={{width:"calc(var(--spacing) * 32)"}}>
                                    <InputGroupAddon align="inline-start">
                                        <InputGroupButton
                                            size={"icon-xs"}
                                            disabled={!is_active}
                                            onClick={() => {
                                                if (!is_active) return;
                                                onQuantityChange(newQuantity - 1);
                                            }}
                                        >
                                            <Icon></Icon>
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size={"icon-xs"}
                                            disabled={!is_active}
                                            onClick={() => {
                                                if (!is_active) return;
                                                onQuantityChange(newQuantity + 1);
                                            }}
                                        >
                                            <Icon></Icon>
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        style={{ textAlign: "center" }}
                                        type="number"
                                        min={1}
                                        disabled={!is_active}
                                        value={newQuantity}
                                        onChange={(e) => {
                                            if (!is_active) return;
                                            onQuantityChange(Number(e.target.value), true);
                                        }}
                                    />
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
                                <Button variant={"destructive"} size={"sm"}
                                onClick={() => sendDeleteCartRequest()}
                                >
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
