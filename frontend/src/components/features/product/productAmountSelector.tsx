import React, { useEffect, useState } from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import { Field, FieldDescription, Icon, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@components/ui/NebulaUI';

interface ProductAmountSelectorProps {
    stock: number;
    availability: "in_stock" | "low_stock" | "out_of_stock";
}

const ProductAmountSelector: React.FC<ProductAmountSelectorProps> = ({ stock, availability }) => {
    const [value, setValue] = useState<string | number>(1);

    const availabilityConfig = {
        in_stock: {
            text: (stock: number) =>  `${stock} left in stock`,
            className: style.inStock,
        },
        low_stock: {
            text: (stock: number) => `Only ${stock} left!`,
            className: style.lowStock,
        },
        out_of_stock: {
            text: "Out of stock",
            className: style.outOfStock,
        },
    } as const;

    const config = availabilityConfig[availability];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        if (Number(raw) === 0 && raw !== "") return;

        if (/^\d*$/.test(raw)) {
            setValue(Number(raw) || "");
        }
    };

    const commitValue = () => {
        setValue(Math.max(1, Math.min(stock, Number(value))));
    };

    useEffect(() => {
        setValue((prev) => {
            const numeric = Number(prev);

            if (!numeric || Number.isNaN(numeric)) {
                return Math.min(1, stock);
            }

            return Math.min(numeric, stock);
        });
    }, [stock]);


    return (
        <Field>
            <FieldDescription>Amount</FieldDescription>

            <Field orientation={"horizontal"}>
                <InputGroup style={{width: "calc(var(--spacing) * 30)"}}>
                    <InputGroupAddon align='inline-start'>
                        <InputGroupButton 
                            size={"icon-xs"}
                            onClick={() => setValue((v) => Math.max(1, Number(v) - 1))}
                        >
                            <Icon></Icon>
                        </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupAddon align='inline-end'>
                        <InputGroupButton 
                            size={"icon-xs"}
                            onClick={() => setValue((v) => Math.min(stock, Number(v) + 1))}
                        >
                            <Icon></Icon>
                        </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupInput
                        style={
                            {textAlign:"center"}
                        }
                        type="text"
                        min={1}
                        max={stock}
                        value={value}
                        onChange={handleChange}
                        onBlur={commitValue}
                    />
                </InputGroup>
                <FieldDescription className={config.className}>
                {typeof config.text === "function"
                    ? config.text(stock)
                    : config.text}
                </FieldDescription>
            </Field>

        </Field>
    );
};


export default ProductAmountSelector;