import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";
import {
    FieldDescription,
    Field,
    FieldLabel,
    FieldGroup,
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
    Input,
    Textarea,
} from "@components/ui/NebulaUI";
import React, { useState } from "react";
import s from "@styles/layouts/seller/addProduct.module.scss";

import ImageUploader from "@components/ui/Nebula/image-uploader";
import ProductVariantPanel, { ProductVariantResponse } from "./addProduct/productVariant";
import ProductSpecificationTable, { Specification } from "./addProduct/specTable";
import ProductDataField from "./addProduct/productData";
import { VariantRow } from "@/types/product";
import { useRouter } from "next/router";
import { createProduct } from "@/api/product";


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
                        onChange={(patch) =>
                            setProductInfo(prev => ({ ...prev, ...patch }))
                        }
                        specifications={specifications}
                        onSpecChange={setSpecifications}
                    />

                    <ProductVariantPanel
                        onChange={setVariantData}
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
                onChange={setProductData}
                hasVariant={variantData.hasVariant}
                variants={variantData.variants}
            />

        </SellerLayout>
    );
};

const AddProductHeader: React.FC<{
    data: {
        name: string;
        description: string;
        images: (File | string)[];
    };
    onChange: (patch: Partial<{
        name: string;
        description: string;
        images: (File | string)[];
    }>) => void;
    specifications: Specification[];
    onSpecChange: (specs: Specification[]) => void;
}> = ({ data, onChange, specifications, onSpecChange }) => {

    return (
        <SellerContent>
            <FieldGroup>

                <FieldLegend style={{ margin: 0 }}>
                    Product Information
                </FieldLegend>

                <FieldSeparator />

                <Field>
                    <FieldLabel>Product Name</FieldLabel>
                    <Input
                        className={s.input}
                        value={data.name}
                        onChange={(e) =>
                            onChange({ name: e.target.value })
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>About product</FieldLabel>
                    <FieldDescription>
                        Enter detailed information about the product.
                    </FieldDescription>
                    <Textarea
                        className={s.textarea}
                        value={data.description}
                        onChange={(e) =>
                            onChange({ description: e.target.value })
                        }
                    />
                </Field>

                <ProductSpecificationTable
                    value={specifications}
                    onChange={onSpecChange}
                />

                <Field className={s.productImagesField}>
                    <FieldLegend variant="label">
                        Product Images
                    </FieldLegend>

                    <FieldDescription>
                        Upload up to 5 images.
                    </FieldDescription>

                    <ImageUploader
                        min={1}
                        accept="image/jpeg, image/png"
                        value={data.images}
                        onChange={(urls) =>
                            onChange({ images: urls })
                        }
                    />
                </Field>

            </FieldGroup>
        </SellerContent>
    );
};

const ProductSettingPanel: React.FC<{
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
}> = ({ data, onChange }) => {

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
};

export default AddProduct;