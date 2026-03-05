import { SellerContent } from "@components/layouts/sellerPageLayout";
import { Button } from "@components/ui/Nebula/button";
import { ButtonGroup } from "@components/ui/Nebula/button-group";
import { Checkbox } from "@components/ui/Nebula/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator } from "@components/ui/Nebula/field";
import { Icon } from "@components/ui/Nebula/icon";
import { Input } from "@components/ui/Nebula/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@components/ui/Nebula/input-group";
import { useEffect, useState } from "react";
import s from "@styles/layouts/seller/addProduct.module.scss"


export interface VariantGroup {
    id: string;
    name: string;
    options: string[];
};

export interface ProductVariantResponse {
    hasVariant: boolean;
    variants: VariantGroup[];
};

type AddProductVariantProps = {
    onChange: (value: ProductVariantResponse) => void;
};

const ProductVariantPanel: React.FC<AddProductVariantProps> = ({ onChange }) => {
    const [hasVariant, setHasVariant] = useState(false);
    const [variants, setVariants] = useState<VariantGroup[]>([]);

    // * notify parent whenever state changes
    useEffect(() => {
        if (!hasVariant) {
            onChange({
                hasVariant: false,
                variants: []
            });
            return;
        }

        onChange({
            hasVariant: true,
            variants
        });
    }, [hasVariant, variants, onChange]);

    const addVariantGroup = () => {
        setVariants(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: "",
                options: []
            }
        ]);
    };

    const removeVariantGroup = (id: string) => {
        setVariants(prev => prev.filter(v => v.id !== id));
    };

    const updateVariantName = (id: string, name: string) => {
        setVariants(prev =>
            prev.map(v =>
                v.id === id ? { ...v, name } : v
            )
        );
    };

    const addOption = (id: string, value: string) => {
        if (!value.trim()) return;

        setVariants(prev =>
            prev.map(v =>
                v.id === id
                    ? { ...v, options: [...v.options, value] }
                    : v
            )
        );
    };

    const removeOption = (id: string, index: number) => {
        setVariants(prev =>
            prev.map(v =>
                v.id === id
                    ? {
                        ...v,
                        options: v.options.filter((_, i) => i !== index)
                    }
                    : v
            )
        );
    };
    
    return (
        <SellerContent>

        <Field orientation="horizontal">
            <Field>
            <FieldLegend style={{ margin: "0 auto" }}>
                Product Variants
            </FieldLegend>
            </Field>
        </Field>

        <FieldSeparator />

        <Field orientation="horizontal">
            <Checkbox
            id="has-variant"
            checked={hasVariant}
            onCheckedChange={(v) => setHasVariant(Boolean(v))}
            />
            <FieldLabel htmlFor="has-variant">
            This product has multiple variants (e.g. sizes or colors)
            </FieldLabel>
        </Field>

        {!hasVariant && null}

        {hasVariant && (
            <FieldGroup>

            {variants.map((variant) => (
                <Field key={variant.id} orientation="horizontal">

                <Input
                    placeholder="Variant Name"
                    value={variant.name}
                    onChange={(e) =>
                    updateVariantName(variant.id, e.target.value)
                    }
                    style={{
                    width: "calc(var(--spacing) * 48)",
                    flexShrink: 0
                    }}
                />

                <InputGroup style={{ width: "100%" }}>
                    <InputGroupAddon align="inline-start">

                    {variant.options.map((opt, i) => (
                        <div key={i} className={s.variantChip}>
                        <p>{opt}</p>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeOption(variant.id, i)}
                        >
                            <Icon style={{fontSize: "var(--text-extra-small)", lineHeight: "var(--text-xs--line-height)"}} value="" />
                        </Button>
                        </div>
                    ))}

                    </InputGroupAddon>

                    <InputGroupInput
                    placeholder="Type option and press Enter"
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return;

                        e.preventDefault();

                        const value = e.currentTarget.value;
                        addOption(variant.id, value);
                        e.currentTarget.value = "";
                    }}
                    />
                </InputGroup>

                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => removeVariantGroup(variant.id)}
                >
                    <Icon value=""/>
                </Button>

                </Field>
            ))}

            <ButtonGroup>
                <Button
                variant="outline"
                type="button"
                size="sm"
                onClick={addVariantGroup}
                >
                <Icon style={{fontSize: "var(--text-extra-small)", lineHeight: "var(--text-xs--line-height)"}} value="" />

                Add Product Variant
                </Button>
            </ButtonGroup>

            </FieldGroup>
        )}

        </SellerContent>
    );
};

export default ProductVariantPanel;