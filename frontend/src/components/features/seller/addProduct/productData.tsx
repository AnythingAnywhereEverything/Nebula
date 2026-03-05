import ImageUploader from "@components/ui/Nebula/image-uploader";
import {
    Button,
    Checkbox,
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    Icon,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@components/ui/NebulaUI";
import { cn } from "@lib/utils";

import s from "@styles/layouts/seller/addProduct.module.scss";
import { ProductVariantResponse } from "./productVariant";
import { generateVariantMatrix } from "@lib/productVariant";
import { useEffect, useState } from "react";
import { VariantRow } from "@/types/product";

export type ProductDataFieldProps = ProductVariantResponse & {
    onChange: (value: {
        hasVariant: boolean;
        variants: VariantRow[];
    }) => void;
};

const ProductDataField = ({
    variants,
    hasVariant,
    onChange
}: ProductDataFieldProps) => {
    const [matrix, setMatrix] = useState<VariantRow[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [singleVariant, setSingleVariant] = useState<VariantRow>({
        id: crypto.randomUUID(),
        values: {}, // * no attributes
        isEnabled: true,

        sku: "",
        price: "",
        salePrice: "",
        cost: "",
        onSale: false,
        stock: "",
        barcode: "",
        images: []
    });

    useEffect(() => {
        if (!hasVariant) {
            setMatrix([]);
            return;
        }

        const base = generateVariantMatrix(variants);

        setMatrix(prev => {

            return base.map(row => {

                const existing = prev.find(p => p.id === row.id);

                if (existing) {
                    return existing; 
                    // * preserve previously created data
                }

                return {
                    id: row.id,
                    values: row.values,

                    isEnabled: false, // * new combination
                    sku: "",
                    price: "",
                    salePrice: "",
                    cost: "",
                    onSale: false,
                    stock: "",
                    barcode: "",
                    images: []
                };
            });

        });

    }, [variants, hasVariant]);

    useEffect(() => {
        if (!hasVariant) {
            onChange({
                hasVariant: false,
                variants: [singleVariant] // * always one
            });
            return;
        }

        const enabledVariants = matrix.filter(v => v.isEnabled);

        onChange({
            hasVariant: true,
            variants: enabledVariants
        });

    }, [matrix, singleVariant, hasVariant, onChange]);

    const updateVariant = (id: string, patch: Partial<VariantRow>) => {
        setMatrix(prev =>
            prev.map(row =>
                row.id === id ? { ...row, ...patch } : row
            )
        );
    };

    const selectedVariant = matrix.find(v => v.id === selectedId);

    return (
        <Field className={s.productDataField}>
            {
                hasVariant ?
                <Field orientation={"horizontal"} stretch>
                    <MultiProductPanel
                        matrix={matrix}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />

                    {selectedVariant && (
                        selectedVariant.isEnabled ? (
                            <MultiProductField
                                data={selectedVariant}
                                onChange={(patch) =>
                                    updateVariant(selectedVariant.id, patch)
                                }
                                onRemove={() =>
                                    updateVariant(selectedVariant.id, {
                                        isEnabled: false,
                                        sku: "",
                                        price: "",
                                        stock: "",
                                        images: []
                                    })
                                }
                            />
                        ) : (
                            <MultiProductFieldNodata
                                onAdd={() =>
                                    updateVariant(selectedVariant.id, {
                                        isEnabled: true
                                    })
                                }
                            />
                        )
                    )}
                </Field>
                :
                <SingleProductField
                    data={singleVariant}
                    onChange={(patch) =>
                        setSingleVariant(prev => ({ ...prev, ...patch }))
                    }
                />
            }
        </Field>
    );
};

const MultiProductFieldNodata = ({
    onAdd
}: {
    onAdd: () => void;
}) => {
    return (
        <FieldGroup className={s.productField}>
            <Button
                variant="outline"
                style={{ height: "calc(var(--spacing) * 16 )" }}
                onClick={onAdd}
            >
                <Icon></Icon>
                Add this product variant
            </Button>
        </FieldGroup>
    );
};

const MultiProductField = ({
    data,
    onChange,
    onRemove
}: {
    data: VariantRow;
    onChange: (patch: Partial<VariantRow>) => void;
    onRemove: () => void;
}) => {

    const sellingPrice = Number(
        data.onSale ? data.salePrice : data.price
    ) || 0;

    const cost = Number(data.cost) || 0;

    const profit = sellingPrice - cost;

    const margin =
        sellingPrice > 0
            ? (profit / sellingPrice) * 100
            : 0;

    return (
        <FieldGroup className={s.productField}>
            <Field className={s.productDataSettings}>
                <FieldLegend style={{ marginBottom: 0 }}>
                    Price Setting
                </FieldLegend>
                <FieldDescription>
                    Upload product images (you can upload up to 5 images)
                </FieldDescription>
                <ImageUploader
                    min={1}
                    max={5}
                    accept={"image/jpeg, image/png"}
                    value={data.images}
                    onChange={ (val) => {
                        onChange({images: val})
                    }}
                />
            </Field>
            <Field className={s.productDataSettings}>
                <FieldLegend>Price Setting</FieldLegend>
                <FieldSeparator />
                <Field
                    orientation={"horizontal"}
                    style={{ alignItems: "start" }}
                >
                    <FieldGroup>
                        <FieldSet disabled={!data.onSale}>
                            <Field>
                                <FieldLabel htmlFor="sale-price">
                                    Sale Price
                                </FieldLabel>
                                <InputGroup id="sale-price">
                                    <InputGroupAddon align="inline-start">
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="500"
                                        value={data.salePrice}
                                        onChange={(e) =>
                                            onChange({ salePrice: e.target.value })
                                        }
                                    />
                                </InputGroup>
                            </Field>
                        </FieldSet>
                        <Field>
                            <FieldLabel>Cost Price</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="250"
                                    value={data.cost}
                                    onChange={(e) =>
                                        onChange({ cost: e.target.value })
                                    }
                                />
                            </InputGroup>
                        </Field>
                        <FieldSet disabled>
                            <Field orientation={"horizontal"}>
                                <Field>
                                    <FieldLabel>Profit</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align="inline-start">
                                            <InputGroupText>$</InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            value={profit.toFixed(2)}
                                            readOnly
                                        />
                                    </InputGroup>
                                </Field>

                                <FieldSeparator />

                                <Field>
                                    <FieldLabel>Margin</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupText>%</InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            value={margin.toFixed(2)}
                                            readOnly
                                        />
                                    </InputGroup>
                                </Field>
                            </Field>
                        </FieldSet>
                    </FieldGroup>
                    <FieldSeparator />
                    <FieldSet style={{ width: "100%" }}>
                        <Field>
                            <FieldLabel>Base Price</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput 
                                    placeholder="700"
                                    value={data.price}
                                    onChange={(e) =>
                                        onChange({ price: e.target.value })
                                    }
                                />
                            </InputGroup>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <Checkbox
                                id="on-sale"
                                checked={data.onSale}
                                onCheckedChange={(v) => {
                                    onChange({ onSale: Boolean(v) });
                                }}
                            />
                            <FieldLabel htmlFor="on-sale">Set product on sale</FieldLabel>
                        </Field>
                    </FieldSet>
                </Field>
            </Field>

            <Field className={s.productDataSettings}>
                <FieldLegend>Inventory</FieldLegend>
                <FieldSeparator />
                <FieldGroup>
                    <Field>
                        <FieldLabel>Stock Quantity</FieldLabel>
                        <Input 
                            placeholder="0" 
                            value={data.stock}
                            onChange={(e) =>
                                onChange({ stock: e.target.value })
                            }
                        />
                    </Field>
                    <Field orientation={"horizontal"}>
                        <Field>
                            <FieldLabel>SKU Number</FieldLabel>
                            <Input
                                value={data.sku}
                                onChange={(e) =>
                                    onChange({ sku: e.target.value })
                                }
                            />
                        </Field>
                        <FieldSeparator />
                        <Field>
                            <FieldLabel>Barcode</FieldLabel>
                            <Input
                                value={data.barcode}
                                onChange={(e) =>
                                    onChange({ barcode: e.target.value })
                                }
                            />
                        </Field>
                    </Field>
                </FieldGroup>
            </Field>
            <Button onClick={onRemove} variant={"destructive"} size={"sm"}>
                Remove this product variant
            </Button>
        </FieldGroup>
    );
};

const MultiProductPanel = ({
    matrix,
    selectedId,
    onSelect
}: {
    matrix: VariantRow[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}) => {

    return (
        <Field className={s.productPanel}>
            <FieldLegend>{matrix.length} Variants</FieldLegend>
            <FieldSeparator />

            <Field>
                {matrix.map(row => {

                    let statusClass = s.status;

                    if (!row.isEnabled) {
                        // * no product created
                    } else {
                        const stock = Number(row.stock || 0);

                        if (stock <= 0) {
                            statusClass = cn(s.status, s.out);
                        } else if (stock < 10) {
                            statusClass = cn(s.status, s.low);
                        } else {
                            statusClass = cn(s.status, s.active);
                        }
                    }

                    return (
                        <Button
                            key={row.id}
                            variant={row.id === selectedId ? "default" : "outline"}
                            onClick={() => onSelect(row.id)}
                        >
                            <Field orientation="horizontal" justify="space-between">
                                <p>{Object.values(row.values).join(" • ")}</p>
                                <div className={statusClass}></div>
                            </Field>
                        </Button>
                    );
                })}
            </Field>
        </Field>
    );
};


const SingleProductField = ({
    data,
    onChange
}: {
    data: VariantRow;
    onChange: (patch: Partial<VariantRow>) => void;
}) => {

    const sellingPrice = Number(
        data.onSale ? data.salePrice : data.price
    ) || 0;

    const cost = Number(data.cost) || 0;

    const profit = sellingPrice - cost;

    const margin =
        sellingPrice > 0
            ? (profit / sellingPrice) * 100
            : 0;

    return (
        <FieldGroup className={s.productField}>
            <Field className={s.productDataSettings}>
                <FieldLegend>Price Setting</FieldLegend>
                <FieldSeparator />

                <Field
                    orientation={"horizontal"}
                    style={{ alignItems: "start" }}
                >
                    <FieldGroup>

                        <FieldSet disabled={!data.onSale}>
                            <Field>
                                <FieldLabel htmlFor="sale-price">
                                    Sale Price
                                </FieldLabel>
                                <InputGroup id="sale-price">
                                    <InputGroupAddon align="inline-start">
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        value={data.salePrice}
                                        onChange={(e) =>
                                            onChange({ salePrice: e.target.value })
                                        }
                                    />
                                </InputGroup>
                            </Field>
                        </FieldSet>

                        <Field>
                            <FieldLabel>Cost Price</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    value={data.cost}
                                    onChange={(e) =>
                                        onChange({ cost: e.target.value })
                                    }
                                />
                            </InputGroup>
                        </Field>

                        <FieldSet disabled>
                            <Field orientation={"horizontal"}>
                                <Field>
                                    <FieldLabel>Profit</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align="inline-start">
                                            <InputGroupText>$</InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            value={profit.toFixed(2)}
                                            readOnly
                                        />
                                    </InputGroup>
                                </Field>

                                <FieldSeparator />

                                <Field>
                                    <FieldLabel>Margin</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupText>%</InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            value={margin.toFixed(2)}
                                            readOnly
                                        />
                                    </InputGroup>
                                </Field>
                            </Field>
                        </FieldSet>
                    </FieldGroup>

                    <FieldSeparator />

                    <FieldSet style={{ width: "100%" }}>
                        <Field>
                            <FieldLabel>Base Price</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    value={data.price}
                                    onChange={(e) =>
                                        onChange({ price: e.target.value })
                                    }
                                />
                            </InputGroup>
                        </Field>

                        <Field orientation={"horizontal"}>
                            <Checkbox
                                checked={data.onSale}
                                onCheckedChange={(v) =>
                                    onChange({ onSale: Boolean(v) })
                                }
                            />
                            <FieldLabel>Set product on sale</FieldLabel>
                        </Field>
                    </FieldSet>
                </Field>
            </Field>

            <Field className={s.productDataSettings}>
                <FieldLegend>Inventory</FieldLegend>
                <FieldSeparator />

                <FieldGroup>
                    <Field>
                        <FieldLabel>Stock Quantity</FieldLabel>
                        <Input
                            value={data.stock}
                            onChange={(e) =>
                                onChange({ stock: e.target.value })
                            }
                        />
                    </Field>

                    <Field orientation={"horizontal"}>
                        <Field>
                            <FieldLabel>SKU Number</FieldLabel>
                            <Input
                                value={data.sku}
                                onChange={(e) =>
                                    onChange({ sku: e.target.value })
                                }
                            />
                        </Field>

                        <FieldSeparator />

                        <Field>
                            <FieldLabel>Barcode</FieldLabel>
                            <Input
                                value={data.barcode}
                                onChange={(e) =>
                                    onChange({ barcode: e.target.value })
                                }
                            />
                        </Field>
                    </Field>
                </FieldGroup>
            </Field>
        </FieldGroup>
    );
};

export default ProductDataField;
