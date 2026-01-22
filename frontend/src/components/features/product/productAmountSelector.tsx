import React, { useEffect, useState } from 'react';
import style from '@styles/layouts/productlayout.module.scss';

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
        <div className={style.amountContainer}>
            <h3>Amount</h3>

            <div className={style.amountSelector}>
                <button onClick={() => setValue((v) => Math.max(1, Number(v) - 1))}>
                -
                </button>

                <input
                    type="text"
                    min={1}
                    max={stock}
                    value={value}
                    onChange={handleChange}
                    onBlur={commitValue}
                />

                <button onClick={() => setValue((v) => Math.min(stock, Number(v) + 1))}>
                +
                </button>
            </div>

            <p className={`${style.stockStatus} ${config.className}`}>
            {typeof config.text === "function"
                ? config.text(stock)
                : config.text}
            </p>
        </div>
    );
};


export default ProductAmountSelector;