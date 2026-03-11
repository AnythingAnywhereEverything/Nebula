import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";
import {
    Field,
    FieldLabel,
    Button,
    FieldSeparator,
    Switch,
    ComboboxItem,
    ComboboxInput,
    ComboboxContent,
    Combobox,
    ComboboxList,
    ComboboxEmpty,
    FieldLegend,
} from "@components/ui/NebulaUI";
import React, { useEffect, useState } from "react";
import { Specification } from "./addProduct/specTable";
import { AttributeOption, ProductAttribute, ProductImage, ProductVariant, VariantValue } from "@/types/product";
import { useRouter as nextRouter } from "next/router";
import { getProductInfo, updateProductSetting } from "@/api/product";

import { useRouter, useSearchParams } from 'next/navigation';
import { EditProductHeader } from "./editProduct/editProductHeader";
import EditProductVariantPanel, { ProductVariantResponse } from "./editProduct/editProductVariant";
import EditProductData from "./editProduct/editProductData";

const EditProduct: React.FC = () => {
    const searchParams = useSearchParams();
    const router = nextRouter();
    const { shop_id } = router.query;

    const product_id = searchParams.get("id");
    const selected_variant = searchParams.get("variant");

    if (!product_id || typeof shop_id !== "string") return;

    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        specifications: [] as Specification[]
    });

    const [productImages, setProductImages] = useState<ProductImage[]>([])

    const [productSettings, setProductSettings] = useState({
        isActive: true,
        freeShipping: false,
        category: "",
        shopCategory: ""
    });

    const [variantData, setVariantData] = useState<ProductVariantResponse>({
        hasVariant: false,
        attribute_options: [],
        attributes: []
    });

    const [productData, setProductData] = useState<{
        hasVariant: boolean;
        attributes: ProductAttribute[];
        attribute_options: AttributeOption[];
        variant_value: VariantValue[];
        variant: ProductVariant[];
    }>({
        hasVariant: false,
        attributes: [],
        attribute_options: [],
        variant: [],
        variant_value: []
    });

    useEffect(() => {

        const load = async () => {
            const res = await getProductInfo(shop_id, product_id);

            if (!res) return;

            const { product, attributes, attribute_options, variants, variant_values, specifications, product_images } = res;

            setProductInfo({
                name: product.name ?? "",
                description: product.description ?? "",
                specifications: specifications
            });

            setProductImages(product_images)

            setProductSettings({
                isActive: product.is_active ?? true,
                freeShipping: product.free_shipping ?? false,
                category: "",
                shopCategory: ""
            });

            setVariantData({
                hasVariant: product.has_variants,
                attribute_options: attribute_options,
                attributes: attributes
            });

            setProductData({
                hasVariant: product.has_variants,
                attributes: attributes,
                attribute_options: attribute_options,
                variant_value: variant_values,
                variant: variants
            });
        };

        load();
    }, [shop_id, product_id]);    
    return (
        <SellerLayout>

            <Field orientation="horizontal">
                <SellerHeader>
                    Edit Products
                </SellerHeader>
            </Field>

            <Field orientation="horizontal" style={{ alignItems: "stretch" }}>

                <Field>

                    <EditProductHeader
                        data={productInfo}
                        images={productImages}
                        product_id={product_id}
                        shop_id={shop_id}
                    />
                    {
                        variantData.hasVariant &&
                        <EditProductVariantPanel
                            data={variantData}
                            onChange={() =>{}}
                        />
                    }

                </Field>

                <ProductSettingPanel
                    data={productSettings}
                    product_id={product_id}
                    shop_id={shop_id}
                />

            </Field>

            <EditProductData
                data={productData}
                shop_id={shop_id}
                product_id={product_id}
                variant_id={selected_variant}
            />

        </SellerLayout>
    );
};

interface SettingPanelProps {
    shop_id: string,
    product_id: string,
    data: {
        isActive: boolean;
        freeShipping: boolean;
        category: string;
        shopCategory: string;
    };
}

const ProductSettingPanel = React.memo(({
    shop_id,
    product_id,
    data,
}: SettingPanelProps) => {
    const router = useRouter()

    const [old, setOld] = useState(data);
    const [draft, setDraft] = useState(data);

    useEffect(() => {
        setOld(data)
        setDraft(data)
    }, [data])

    const isSettingChanged = () => {
        return JSON.stringify(old) !== JSON.stringify(draft)
    }

    const onSubmit = async () => {
        const data = {
            active: draft.isActive,
            free_shipping: draft.freeShipping
        }

        await updateProductSetting(shop_id, product_id, data);
        router.refresh()
    }

    return (
        <SellerContent style={{ width: "fit-content", minWidth: 300 }}>

            <Field orientation={"horizontal"} justify={"space-between"}>
                <FieldLegend style={{ margin: 0 }}>
                    Product Setting
                </FieldLegend>
                <Button size={"sm"} onClick={onSubmit} disabled={!isSettingChanged()}>
                    Save
                </Button>
            </Field>

            <FieldSeparator />

            <Field orientation="horizontal">
                <FieldLabel>Activate</FieldLabel>
                <Switch
                    checked={draft.isActive}
                    onCheckedChange={(v) =>
                        setDraft(p => ({
                            ...p,
                            isActive: v
                        }))
                    }
                />
            </Field>

            <Field orientation="horizontal">
                <FieldLabel>Free Shipping</FieldLabel>
                <Switch
                    checked={draft.freeShipping}
                    onCheckedChange={(v) =>
                        setDraft(p => ({
                            ...p,
                            freeShipping: v
                        }))
                    }
                />
            </Field>

            <FieldSeparator />

            <Field>
                <FieldLabel>Category</FieldLabel>
                <Combobox
                    value={draft.category}
                    onValueChange={(v) =>
                        setDraft(p => ({
                            ...p,
                            category: v || ""
                        }))
                    }
                >
                    <ComboboxInput placeholder="Search Category" />
                    <ComboboxContent>
                        <ComboboxEmpty>No category found.</ComboboxEmpty>
                        <ComboboxList>
                            <ComboboxItem value="electronics">Electronics</ComboboxItem>
                            <ComboboxItem value="clothing">Clothing</ComboboxItem>
                            <ComboboxItem value="books">Books</ComboboxItem>
                            <ComboboxItem value="home">Home & Garden</ComboboxItem>
                            <ComboboxItem value="toys">Toys & Games</ComboboxItem>
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </Field>

            <Field>
                <FieldLabel>Shop Category</FieldLabel>
                <Combobox
                    value={draft.shopCategory}
                    onValueChange={(v) =>
                        setDraft(p => ({
                            ...p,
                            shopCategory: v || ""
                        }))
                    }
                >
                    <ComboboxInput placeholder="Search Category" />
                    <ComboboxContent>
                        <ComboboxEmpty>No category found.</ComboboxEmpty>
                        <ComboboxList>
                            <ComboboxItem value="electronics">Electronics</ComboboxItem>
                            <ComboboxItem value="clothing">Clothing</ComboboxItem>
                            <ComboboxItem value="books">Books</ComboboxItem>
                            <ComboboxItem value="home">Home & Garden</ComboboxItem>
                            <ComboboxItem value="toys">Toys & Games</ComboboxItem>
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </Field>

        </SellerContent>
    );
});

export default EditProduct;