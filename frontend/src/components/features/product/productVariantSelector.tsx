import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import type { ProductOption, ProductVariant } from "@/types/product";
import router from 'next/router';
import { Button, Field, FieldDescription, FieldSet } from '@components/ui/NebulaUI';

interface ProductVariantSelectorProps {
    options?: ProductOption[];
    variants: ProductVariant[];
    nsin: string;
    prodName: string;
}


const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
    options,
    variants,
    nsin,
    prodName
}) => {
    const [selected, setSelected] = React.useState<Record<string, string>>({});
    
    function capitalizeFirstLetter(val:string) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    if (!options) return null;

    const findVariantForValue = (optionName: string, value: string) =>
        variants.find(
        (variant) =>
            variant.stock > 0 &&
            variant.attributes[optionName] === value
        );

    const handleSelect = (optionName: string, value: string) => {
        const variant = findVariantForValue(optionName, value);
        if (!variant) return;

        router.push(`/product/${variant.nsin}/${encodeURIComponent(prodName)}`)
    };

    const getValueState = (
        optionName: string,
        value: string
    ): "active" | "available" | "alternative" | "disabled" => {
        if (!currentVariant) return "disabled";

        if (currentVariant.attributes[optionName] === value) {
            return "active";
        }

        const keepsSelection = variants.some(
            (v) =>
            v.stock > 0 &&
            v.attributes[optionName] === value &&
            Object.entries(currentVariant.attributes).every(
                ([key, val]) =>
                key === optionName || v.attributes[key] === val
            )
        );
        if (keepsSelection) return "available";

        const alternativeAvailable = variants.some(
            (v) =>
            v.stock > 0 &&
            v.attributes[optionName] === value
        );
        if (alternativeAvailable) return "alternative";

        return "disabled";
    };


    const currentVariant = React.useMemo(
        () => variants.find((v) => v.nsin === nsin),
        [variants, nsin]
    );

    React.useEffect(() => {
        if (currentVariant) {
            setSelected(currentVariant.attributes);
        }
    }, [currentVariant]);


    return (
        <FieldSet>
        {[...options]
            .sort((a, b) => a.order - b.order)
            .map((option) => (
            <Field key={option.name}>
                <FieldDescription>
                    {capitalizeFirstLetter(option.name)}
                    {selected[option.name] && ` : ${selected[option.name]}`}
                </FieldDescription>

                <Field orientation={"horizontal"} style={{marginLeft: "var(--spacing)"}}>
                {option.values.map((value) => {
                    const state = getValueState(option.name, value);

                    return (
                        <Button variant={"outline"} size={"sm"}
                            key={value}
                            disabled={state === "disabled"}
                            className={[
                                style.option,
                                state === "active" && style.active,
                                state === "available" && style.available,
                                state === "alternative" && style.alternative
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() => handleSelect(option.name, value)}
                            >
                            {value}
                        </Button>
                    );
                })}
                </Field>
            </Field>
            ))}
        </FieldSet>
    );
};


export default ProductVariantSelector;