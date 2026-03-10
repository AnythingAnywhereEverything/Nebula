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
import React, { useCallback, useState } from "react";
import ProductVariantPanel, { ProductVariantResponse } from "./addProduct/productVariant";
import { Specification } from "./addProduct/specTable";
import ProductDataField from "./addProduct/productData";
import { VariantRow } from "@/types/product";
import { useRouter } from "next/router";
import { createProduct } from "@/api/product";
import { AddProductHeader } from "./addProduct/addProductHeader";


const AddProduct: React.FC = () => {

    const router = useRouter();
    const { shop_id, slug } = router.query;

    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        images: [] as (File | string)[]
    });

    const [productSettings, setProductSettings] = useState({
        isActive: true,
        freeShipping: false,
        category: "",
        shopCategory: ""
    });

    const [variantData, setVariantData] = useState<ProductVariantResponse>({
        hasVariant: false,
        variants: []
    });

    const [productData, setProductData] = useState<{
        hasVariant: boolean;
        variants: VariantRow[];
    }>({
        hasVariant: false,
        variants: []
    });

    const [specifications, setSpecifications] = useState<Specification[]>([]);

    const handleProductInfo = useCallback((patch: Partial<typeof productInfo>) => {
        setProductInfo(prev => ({ ...prev, ...patch }));
    }, []);

    const handleVariantInfo = useCallback((patch: Partial<typeof variantData>) => {
        setVariantData(prev => ({ ...prev, ...patch }));
    }, []);
    
    const handleProductDataChange = React.useCallback((value: {
        hasVariant: boolean;
        variants: VariantRow[];
    }) => {
        setProductData(value);
    }, []);

    const handleSubmit = () => {

        const finalPayload = {
            ...productInfo,
            ...productSettings,
            attributes: variantData.variants,
            hasVariant: productData.hasVariant,
            variants: productData.variants,
            specifications
        };
        
        if (typeof shop_id === 'string') {
            createProduct(finalPayload, shop_id);
        }
    };

    return (
        <SellerLayout>

            <Field orientation="horizontal">
                <SellerHeader>
                    Add New Products
                </SellerHeader>
                <Button onClick={handleSubmit}>
                    Create Product
                </Button>
            </Field>

            <Field orientation="horizontal" style={{ alignItems: "stretch" }}>

                <Field>

                    <AddProductHeader
                        data={productInfo}

                        onChange={handleProductInfo}

                        specifications={specifications}
                        onSpecChange={setSpecifications}
                    />

                    <ProductVariantPanel
                        onChange={handleVariantInfo}
                    />

                </Field>

                <ProductSettingPanel
                    data={productSettings}
                    onChange={(patch) =>
                        setProductSettings(prev => ({ ...prev, ...patch }))
                    }
                />

            </Field>

            <ProductDataField
                onChange={handleProductDataChange}
                hasVariant={variantData.hasVariant}
                variants={variantData.variants}
            />

        </SellerLayout>
    );
};

interface SettingPanelProps {
    data: {
        isActive: boolean;
        freeShipping: boolean;
        category: string;
        shopCategory: string;
    };
    onChange: (patch: Partial<{
        isActive: boolean;
        freeShipping: boolean;
        category: string;
        shopCategory: string;
    }>) => void;
}

const ProductSettingPanel = React.memo(({
    data,
    onChange
}: SettingPanelProps) => {
    return (
        <SellerContent style={{ width: "fit-content", minWidth: 300 }}>

            <FieldLegend>Product Settings</FieldLegend>

            <FieldSeparator />

            <Field orientation="horizontal">
                <FieldLabel>Activate</FieldLabel>
                <Switch
                    checked={data.isActive}
                    onCheckedChange={(v) =>
                        onChange({ isActive: Boolean(v) })
                    }
                />
            </Field>

            <Field orientation="horizontal">
                <FieldLabel>Free Shipping</FieldLabel>
                <Switch
                    checked={data.freeShipping}
                    onCheckedChange={(v) =>
                        onChange({ freeShipping: Boolean(v) })
                    }
                />
            </Field>

            <FieldSeparator />

            <Field>
                <FieldLabel>Category</FieldLabel>
                <Combobox
                    value={data.category}
                    onValueChange={(v) =>
                        onChange({ category: v || "" })
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
                    value={data.shopCategory}
                    onValueChange={(v) =>
                        onChange({ shopCategory: v || "" })
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

export default AddProduct;