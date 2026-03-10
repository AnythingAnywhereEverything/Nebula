import ImageUploader from "@components/ui/Nebula/image-uploader";
import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { generateVariantMatrix } from "@lib/productVariant";
import React, { useEffect, useState } from "react";
import { AttributeOption, MatrixVariant, ProductAttribute, ProductImage, ProductVariant, VariantRow, VariantValue } from "@/types/product";
import { createNewProductVariant, getProductVariant, GetVariantResponse, updateProductVariant } from "@/api/product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type EditProductDataProps = {
    hasVariant: boolean;
    attributes: ProductAttribute[];
    attribute_options: AttributeOption[];
    variant_value: VariantValue[];
    variant: ProductVariant[];
}

export type EditProductDataFieldProps = {
    data: EditProductDataProps
    shop_id: string,
    product_id: string,
    variant_id: string | null
};

export const generateMatrix = (
    attributes: ProductAttribute[],
    options: AttributeOption[],
    variantValues: VariantValue[],
    variants: ProductVariant[]
): {
    id: string;
    key: string;
    attribute_option_ids: string[];
    values: Record<string, string>;
    stock: string;
    isEnable: boolean;
}[] => {

    const groups = attributes.map(attr =>
        options.filter(o => o.attribute_id === attr.id)
    );

    if (groups.length === 0) return [];

    const cartesian = (arr: AttributeOption[][]): AttributeOption[][] =>
        arr.reduce(
            (a, b) => a.flatMap(d => b.map(e => [...d, e])),
            [[]] as AttributeOption[][]
        );

    const combos = cartesian(groups);

    const variantMap = new Map(variants.map(v => [v.id, v]));

    const variantLookup = new Map<string, string>();
    const variantGroups: Record<string, string[]> = {};

    for (const v of variantValues) {
        if (!variantGroups[v.variant_id]) {
            variantGroups[v.variant_id] = [];
        }

        variantGroups[v.variant_id].push(v.attribute_option_id);
    }

    Object.entries(variantGroups).forEach(([variantId, optionIds]) => {
        const key = optionIds.sort().join("_");
        variantLookup.set(key, variantId);
    });

    return combos.map(combo => {

        const optionIds = combo.map(o => o.id);
        const key = [...optionIds].sort().join("_");

        const variantId = variantLookup.get(key);
        const variant = variantId ? variantMap.get(variantId) : undefined;

        const values: Record<string, string> = {};

        combo.forEach(opt => {
            const attr = attributes.find(a => a.id === opt.attribute_id);
            if (attr) {
                values[attr.name] = opt.value;
            }
        });

        return {
            id: variantId ?? key,
            key: key,
            attribute_option_ids: optionIds,
            values,

            stock: variant?.stock ?? "0",
            isEnable: variant?.isEnabled ?? false
        };
    });
};

const EditProductDataField = ({
    data,
    shop_id, 
    product_id,
    variant_id
}: EditProductDataFieldProps) => {

    const [matrix, setMatrix] = useState<MatrixVariant[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [created, setCreated] = useState(false);

    const [hasUnsaved, SetHasUnsaved] = useState(false);

    const [singleVariant, setSingleVariant] = useState<ProductVariant>({
        id: "",
        sku: "",
        price: "",
        salePrice: "",
        cost: "",
        onSale: false,
        stock: "",
        barcode: "",
        isEnabled: false
    });

    useEffect(() => {

        // * always update single variant
        if (data.variant?.length) {
            setSingleVariant(data.variant[0]);
        }

        if (!data.hasVariant) {
            setMatrix([]);
            return;
        }

        const base = generateMatrix(
            data.attributes,
            data.attribute_options,
            data.variant_value,
            data.variant
        );

        setMatrix(prev =>
            base.map(row => {

                const existing = prev.find(p => p.id === row.id);

                if (existing) return existing;

                return {
                    id: row.id,
                    key: row.key,
                    attribute_option_ids: row.attribute_option_ids,
                    isEnabled: row.isEnable,
                    stock: row.stock,
                    values: row.values
                };
            })
        );

    }, [data]);

    useEffect(() => {
        if (variant_id!=null) {
            setSelectedId(variant_id)
            setCreated(true)
            SetHasUnsaved(false)
        } else {
            setCreated(false)
            SetHasUnsaved(false)
        }
    }, [variant_id])

    const updateVariant = (id: string, patch: Partial<MatrixVariant>) => {
        setMatrix(prev =>
            prev.map(v =>
                v.id === id ? { ...v, ...patch } : v
            )
        );
    };

    const selectedVariant = matrix.find(v => v.id === (selectedId));

    return (
        <Field className={s.productDataField}>

            {data.hasVariant ? (
                <Field orientation="horizontal" stretch>

                    <MultiProductPanel
                        matrix={matrix}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        hasUnsaved={hasUnsaved}
                    />

                    {selectedVariant && (

                        selectedVariant.isEnabled ? (

                            <MultiProductField
                                variant_id={variant_id}
                                shop_id={shop_id}
                                product_id={product_id}
                                is_exist={created}
                                OnDifferent={SetHasUnsaved}
                                selectedAtt={selectedVariant.attribute_option_ids}
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
            ) : (

                <SingleProductField
                    data={singleVariant}
                    shop_id={shop_id}
                    product_id={product_id}
                />

            )}

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

type ImgPrepared = ProductImage & { file: File | null }

const MultiProductField = ({
    variant_id,
    product_id,
    shop_id,
    is_exist,
    OnDifferent,
    selectedAtt
}: {
    variant_id: string | null
    shop_id: string
    product_id: string
    is_exist: boolean
    OnDifferent: (diff: boolean) => void
    selectedAtt: string[]
}) => {
    const router = useRouter()

    const base = {
        id: "",
        sku: "",
        price: "",
        salePrice: "",
        cost: "",
        onSale: false,
        stock: "",
        barcode: "",
        isEnabled: false
    }

    const [oldImages, setOldImages] = useState<ProductImage[]>([]);
    const [imgPrepare, setImgPrepare] = useState<ImgPrepared[]>([])

    const [old, setOld] = useState<ProductVariant>(base);
    const [draft, setDraft] = useState<ProductVariant>(base);

    useEffect(() => {
        if (is_exist && variant_id) {
            const load = async () => {
                const data = await getProductVariant(shop_id, product_id, variant_id)
                
                setOld(data.variant)
                setDraft(data.variant)
                
                setOldImages(data.variant_images)
                
                setImgPrepare(
                    data.variant_images.map(i => ({
                        ...i,
                        file: null
                    }))
                )
            }
            
            load()
            return
        }
        
        setOld(base)
        setDraft(base)
        setOldImages([])
        setImgPrepare([])
        OnDifferent(false)
    }, [variant_id, product_id, shop_id, is_exist])

    const onSubmitCreate = async () => {
        // * prepare data

        const files = imgPrepare
            .map(v => v.file)
            .filter((file): file is File => file !== null)

        const data = {
            attribute_options: selectedAtt,
            sku: draft.sku,
            price: draft.price,
            salePrice: draft.salePrice,
            cost: draft.cost,
            onSale: draft.onSale,
            stock: draft.stock,
            barcode: draft.barcode,
            isEnabled: true,

            files: files
        }

        await createNewProductVariant(shop_id, product_id, data);
        router.refresh()
    }

    const onSubmitUpdate = async () => {
        if (!variant_id) return;

        const images = imgPrepare.map((v) => ({
            id: v.id !== "" ? v.id : null
        }))

        const files = imgPrepare
            .map(v => v.file)
            .filter((file): file is File => file !== null)

        const data = {
            attribute_options: selectedAtt,
            sku: draft.sku,
            price: draft.price,
            salePrice: draft.salePrice,
            cost: draft.cost,
            onSale: draft.onSale,
            stock: draft.stock,
            barcode: draft.barcode,
            isEnabled: true,

            images: images,
            files: files
        }

        await updateProductVariant(shop_id, product_id, variant_id, data);
        router.refresh()
    } 

    const isVariantDifferent = () => {
        const variantChanged =
            JSON.stringify(old) !== JSON.stringify(draft)

        const imagesChanged = (() => {

            if (oldImages.length !== imgPrepare.length) return true

            const sortedOld = [...oldImages].sort((a, b) => a.position - b.position)
            const sortedNew = [...imgPrepare].sort((a, b) => a.position - b.position)

            for (let i = 0; i < sortedOld.length; i++) {

                const o = sortedOld[i]
                const n = sortedNew[i]

                if (n.file) return true // * new uploaded image

                if (
                    o.id !== n.id ||
                    o.image_url !== n.image_url ||
                    o.position !== n.position
                ) {
                    return true
                }
            }

            return false
        })()

        return variantChanged || imagesChanged
    }

    useEffect(() => {
        OnDifferent(isVariantDifferent())
    }, [draft, imgPrepare, old, oldImages])

    const handleImageChange = (vals: (File | string)[]) => {
        setImgPrepare(prev => {
            return vals.map((v, index) => {
                if (typeof v === "string") {
                    const oldImg = prev.find(i => i.image_url === v);

                    if (oldImg) {
                        return {
                            ...oldImg,
                            position: index
                        };
                    }

                    return {
                        id: "",
                        variant_id,
                        image_url: v,
                        position: index,
                        file: null
                    } as ImgPrepared;
                }

                return {
                    id: "",
                    variant_id,
                    image_url: "",
                    position: index,
                    file: v
                } as ImgPrepared;
            });
        });
    };

    const toNumber = (v: string | undefined) => {
        if (v === "") return "";
        if (!/^\d*\.?\d*$/.test(v || "")) return null;
        return v;
    };

    const sellingPrice = Number(
        toNumber(draft.onSale ? draft.salePrice : draft.price || "")
        || 0
    );
    const cost = Number(toNumber(draft.cost) || 0);

    const profit = sellingPrice - cost;

    const margin =
        sellingPrice > 0
            ? (profit / sellingPrice) * 100
            : 0;
    return (
        <FieldGroup className={s.productField}>
            <Field orientation={"horizontal"}>
                <Field />
                <Button 
                size={"sm"} 
                disabled={!isVariantDifferent()}
                onClick={
                    is_exist ?
                    onSubmitUpdate
                    :
                    onSubmitCreate
                }
                >
                    {
                        is_exist ?
                        "Save Variant data"
                        :
                        "Create Variant"
                    }
                </Button>
            </Field>
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
                    value={[...imgPrepare]
                        .sort((a, b) => a.position - b.position)
                        .map(i => i.image_url !== "" ? i.image_url : (i.file ?? ""))}
                    onChange={handleImageChange}
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
                        <FieldSet disabled={!draft.onSale}>
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
                                        type="number"
                                        inputMode="decimal"
                                        value={draft.salePrice}
                                        onChange={(e) => {
                                            const v = toNumber(e.target.value);
                                            if (v === null) return;
                                            setDraft(p => ({
                                                ...p,
                                                salePrice: e.target.value
                                            }))
                                        }}
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
                                    inputMode="decimal"
                                    value={draft.cost}
                                    onChange={(e) => {
                                        const v = toNumber(e.target.value);
                                        if (v === null) return;
                                        setDraft(p => ({
                                            ...p,
                                            cost: e.target.value
                                        }))
                                    }}
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
                                    value={draft.price}
                                    inputMode="decimal"
                                    onChange={(e) => {
                                        const v = toNumber(e.target.value);
                                        if (v === null) return;
                                        setDraft(p => ({
                                            ...p,
                                            price: e.target.value
                                        }))
                                    }}
                                />
                            </InputGroup>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <Checkbox
                                id="on-sale"
                                checked={draft.onSale}
                                onCheckedChange={(v) => {
                                    if (typeof v !== "boolean") return;
                                    setDraft(p => ({
                                        ...p,
                                        onSale: v
                                    }))
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
                        <FieldLabel htmlFor="stock">Stock Quantity</FieldLabel>
                        <Input
                            id="stock"
                            inputMode="decimal"
                            value={draft.stock}
                            onChange={(e) =>{
                                const v = toNumber(e.target.value);
                                if (v === null) return;
                                setDraft(p => ({ ...p, stock: e.target.value}))
                            }}
                        />
                    </Field>
                    <Field orientation={"horizontal"}>
                        <Field>
                            <FieldLabel htmlFor="sku">SKU Number</FieldLabel>
                            <Input
                                id="sku"
                                value={draft.sku}
                                onChange={(e) =>
                                    setDraft(p => ({ ...p, sku: e.target.value }))
                                }
                            />
                        </Field>
                        <FieldSeparator />
                        <Field>
                            <FieldLabel htmlFor="barcode">Barcode</FieldLabel>
                            <Input
                                id="barcode"
                                value={draft.barcode}
                                onChange={(e) =>
                                    setDraft(p => ({ ...p, barcode: e.target.value }))
                                }
                            />
                        </Field>
                    </Field>
                </FieldGroup>
            </Field>
            {/* <Button onClick={onRemove} variant={"destructive"} size={"sm"}>
                Remove this product variant
            </Button> */}
        </FieldGroup>
    );
};

const MultiProductPanel = ({
    matrix,
    selectedId,
    onSelect,
    hasUnsaved
}: {
    matrix: MatrixVariant[];
    selectedId: string | null;
    hasUnsaved: boolean
    onSelect: (id: string) => void;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

    const [isOpen, setIsOpen] = useState(false)
    const [pendingId, setPendingId] = useState<string | null>(null)

    const changeVariant = (id: string, key: string) => {

        onSelect(id)

        if (id !== key) {
            currentParams.set("variant", id)
        } else {
            currentParams.delete("variant")
        }

        const newUrl = `${pathname}?${currentParams.toString()}`
        router.replace(newUrl, { scroll: false })
    }

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
                        <>
                            <Button
                                key={row.id}
                                variant={row.id === selectedId ? "default" : "outline"}
                                onClick={() => {

                                    if (hasUnsaved) {
                                        setPendingId(row.id)
                                        setIsOpen(true)
                                        return
                                    }

                                    changeVariant(row.id, row.key)
                                }}
                            >
                                <Field orientation="horizontal" justify="space-between">
                                    <p>{Object.values(row.values).join(" • ")}</p>
                                    <div className={statusClass}></div>
                                </Field>
                            </Button>

                        </>
                    );
                })}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>You have an unsaved variant</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone, your change will be lost.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button
                                size={"sm"}
                                onClick={() => {

                                    if (!pendingId) return

                                    const row = matrix.find(r => r.id === pendingId)
                                    if (!row) return

                                    changeVariant(row.id, row.key)

                                    setPendingId(null)
                                    setIsOpen(false)
                                }}
                            >
                                Continue
                            </Button>

                            <Button
                                size={"sm"}
                                variant={"outline"}
                                onClick={() => {
                                    setPendingId(null)
                                    setIsOpen(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Field>
        </Field>
    );
};

const SingleProductField = ({
    data,
    shop_id,
    product_id
}: {
    shop_id: string
    product_id: string
    data: ProductVariant;
}) => {
    const router = useRouter()

    const [draft, setDraft] = React.useState(data);
    const [old, setOld] = React.useState(data);

    React.useEffect(() => {
        setDraft(data);
        setOld(data);
    }, [data.id]);

    const onSubmitUpdate = async () => {
        const data = {
            attribute_options: [],
            sku: draft.sku,
            price: draft.price,
            salePrice: draft.salePrice,
            cost: draft.cost,
            onSale: draft.onSale,
            stock: draft.stock,
            barcode: draft.barcode,
            isEnabled: true,

            images: [],
            files: []
        }

        await updateProductVariant(shop_id, product_id, draft.id, data);
        router.refresh()
    } 


    const isVariantDifferent = () => {
        const variantChanged =
            JSON.stringify(old) !== JSON.stringify(draft)
        return variantChanged
    }

    const toNumber = (v: string) => {
        if (v === "") return "";
        if (!/^\d*\.?\d*$/.test(v)) return null;
        return v;
    };

    const sellingPrice = Number(
        draft.onSale ? draft.salePrice : draft.price || ""
    ) || 0;

    const cost = Number(draft.cost) || 0;

    const profit = sellingPrice - cost;

    const margin =
        sellingPrice > 0
            ? (profit / sellingPrice) * 100
            : 0;

    return (
        <FieldGroup className={s.productField}>
            <Field orientation={"horizontal"}>
                <Field />
                <Button size={"sm"} onClick={onSubmitUpdate} disabled={!isVariantDifferent()}>
                    Save data
                </Button>
            </Field>
            <Field className={s.productDataSettings}>
                <FieldLegend>Price Setting</FieldLegend>
                <FieldSeparator />

                <Field orientation={"horizontal"} style={{ alignItems: "start" }}>
                    <FieldGroup>

                        <FieldSet disabled={!draft.onSale}>
                            <Field>
                                <FieldLabel htmlFor="sale-price">
                                    Sale Price
                                </FieldLabel>
                                <InputGroup id="sale-price">
                                    <InputGroupAddon align="inline-start">
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        value={draft.salePrice ?? ""}
                                        onChange={(e) => {
                                            const v = toNumber(e.target.value);
                                            if (v === null) return;
                                            setDraft(p => ({ ...p, salePrice: v }));
                                        }}
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
                                    value={draft.cost}
                                    onChange={(e) => {
                                        const v = toNumber(e.target.value);
                                        if (v === null) return;
                                        setDraft(p => ({ ...p, cost: v }));
                                    }}
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
                                    value={draft.price}
                                    onChange={(e) => {
                                        const v = toNumber(e.target.value);
                                        if (v === null) return;
                                        setDraft(p => ({ ...p, price: v }));
                                    }}
                                />
                            </InputGroup>
                        </Field>

                        <Field orientation={"horizontal"}>
                            <Checkbox
                                checked={draft.onSale}
                                onCheckedChange={(v) => {
                                    if (typeof v !== "boolean") return;
                                    setDraft(p => ({ ...p, onSale: v }));
                                }}
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
                            value={draft.stock}
                            onChange={(e) => {
                                const v = toNumber(e.target.value);
                                if (v === null) return;
                                setDraft(p => ({ ...p, stock: v }));
                            }}
                        />
                    </Field>

                    <Field orientation={"horizontal"}>
                        <Field>
                            <FieldLabel>SKU Number</FieldLabel>
                            <Input
                                value={draft.sku}
                                onChange={(e) =>
                                    setDraft(p => ({ ...p, sku: e.target.value }))
                                }
                            />
                        </Field>

                        <FieldSeparator />

                        <Field>
                            <FieldLabel>Barcode</FieldLabel>
                            <Input
                                value={draft.barcode}
                                onChange={(e) =>
                                    setDraft(p => ({ ...p, barcode: e.target.value }))
                                }
                            />
                        </Field>
                    </Field>
                </FieldGroup>
            </Field>
        </FieldGroup>
    );
};

export default React.memo(EditProductDataField);