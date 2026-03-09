import { SellerContent } from "@components/layouts/sellerPageLayout";
import { Button } from "@components/ui/Nebula/button";
import { ButtonGroup } from "@components/ui/Nebula/button-group";
import { Checkbox } from "@components/ui/Nebula/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator } from "@components/ui/Nebula/field";
import { Icon } from "@components/ui/Nebula/icon";
import { Input } from "@components/ui/Nebula/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@components/ui/Nebula/input-group";
import { useEffect, useState } from "react";
import s from "@styles/layouts/seller/addProduct.module.scss";
import React from "react";
import { AttributeOption, ProductAttribute } from "@/types/product";

export interface ProductVariantResponse {
    hasVariant: boolean;
    attributes: ProductAttribute[];
    attribute_options: AttributeOption[];
}

type EditProductVariantProps = {
    data: ProductVariantResponse;
    onChange: (value: ProductVariantResponse) => void;
};

const EditProductVariantPanel = ({ data, onChange }: EditProductVariantProps) => {



    const [attributes, setAttributes] = useState<ProductAttribute[]>(data.attributes);
    const [attributeOptions, setAttributeOptions] = useState<AttributeOption[]>(data.attribute_options);


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

            <FieldGroup>

                {attributes.map((attribute) => {

                    const options = attributeOptions.filter(
                        o => o.attribute_id === attribute.id
                    );

                    return (
                        <Field key={attribute.id} orientation="horizontal">

                            <Input
                                placeholder="Variant Name"
                                value={attribute.name}
                                style={{
                                    width: "calc(var(--spacing) * 48)",
                                    flexShrink: 0
                                }}
                            />

                            <InputGroup style={{ width: "100%" }}>
                                <InputGroupAddon align="inline-start">

                                    {options.map((opt) => (
                                        <div key={opt.id} className={s.variantChip} style={{paddingRight: "calc(var(--spacing) * 2 )"}}>
                                            <p>{opt.value}</p>
                                        </div>
                                    ))}
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    );
                })}
            </FieldGroup>

        </SellerContent>
    );
};

export default React.memo(EditProductVariantPanel);