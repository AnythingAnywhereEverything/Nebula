import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";
import { FieldDescription, Field, FieldLabel,
        Input, FieldGroup,
        Button,
        Textarea,
        FieldSeparator,
        ButtonGroup,
        Switch,
        ComboboxItem,
        ComboboxInput,
        ComboboxContent,
        Combobox,
        ComboboxList,
        ComboboxEmpty,
        FieldLegend,
        } from "@components/ui/NebulaUI";
import Form from "next/form";
import React, { useEffect, useRef, useState } from "react";
import s from "@styles/layouts/seller/addProduct.module.scss"
import ImageUploader from "@components/ui/Nebula/image-uploader";
import ProductVariantPanel from "./addProduct/productVariant";
import ProductSpecificationTable from "./addProduct/specTable";

const AddProduct: React.FC = () => {

    return (
        <SellerLayout>
            <SellerHeader>
                Add New Products
            </SellerHeader>
            <Field orientation={"horizontal"} style={{alignItems:"start"}}>
                <Field>
                    <AddProductHeader />
                    <ProductVariantPanel />
                </Field>
                <ProductSettingPanel />
            </Field>
        </SellerLayout>
    )
}

const ProductSettingPanel: React.FC = () => {
    return (
        <SellerContent style={{width: "fit-content", minWidth: "300px"}}>
            <FieldLegend style={{margin: 0}}>Product Settings</FieldLegend>
            <FieldSeparator />
            <Field orientation={"horizontal"}>
                <FieldLabel htmlFor="product-active">Activate</FieldLabel>
                <Switch id="product-active" />
            </Field>
            <Field orientation={"horizontal"}>
                <FieldLabel htmlFor="product-free-shipping">Free Shipping</FieldLabel>
                <Switch id="product-free-shipping" />
            </Field>
            <FieldSeparator/>
            <Field>
                <FieldLabel htmlFor="product-category">category</FieldLabel>
                <Combobox id="product-category">
                    <ComboboxInput placeholder="Search Category" />
                    <ComboboxContent>
                        <ComboboxEmpty>No category found.</ComboboxEmpty>
                        <ComboboxList>
                            {/* Will fetch from `BE` later */}
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
                <FieldLabel htmlFor="product-shop-category">Shop Category</FieldLabel>
                <FieldDescription>Shop category is used to group products in your shop.</FieldDescription>
                <Combobox id="product-shop-category">
                    <ComboboxInput placeholder="Search Category" />
                    <ComboboxContent>
                        <ComboboxEmpty>No category found.</ComboboxEmpty>
                        <ComboboxList>
                            {/* Will fetch from `BE` later */}
                            <ComboboxItem value="electronics">Electronics</ComboboxItem>
                            <ComboboxItem value="clothing">Clothing</ComboboxItem>
                            <ComboboxItem value="books">Books</ComboboxItem>
                            <ComboboxItem value="home">Home & Garden</ComboboxItem>
                            <ComboboxItem value="toys">Toys & Games</ComboboxItem>
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </Field>
            <FieldSeparator />
            <Field>
                <FieldLabel htmlFor="product-price">Global Price</FieldLabel>
                <FieldDescription>
                    Default price for the product and variant.
                </FieldDescription>
                <Input
                    id="product-price"
                    placeholder="Enter product price"
                    type="number"
                    min={0}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="product-sku">Product SKU Number</FieldLabel>
                <Input
                    id="product-sku"
                    placeholder="Enter product SKU number"
                />
            </Field>
        </SellerContent>
    )
}
const AddProductHeader: React.FC = () => {

    const product_urls = [
        "https://placehold.co/600x400",
        "https://placehold.co/600x500",
        "https://placehold.co/600x600",
    ];

    const onChangeProductUrls = (urls: (File | string)[]) => {
        console.log(urls);
    }

    return (
        <SellerContent>
            <Form action={""} className={s.form}>
                <FieldGroup>

                    <FieldLegend style={{margin: 0}}>Product Information</FieldLegend>
                    <FieldSeparator/>

                    <Field>
                        <FieldLabel htmlFor="product-name">
                            Product Name
                        </FieldLabel>
                        <Input
                            id="product-name"
                            placeholder="Enter product name"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="product-about">
                            About product
                        </FieldLabel>

                        <FieldDescription>
                            Enter detailed information about the product (can be use with markdown)
                        </FieldDescription>

                        <Textarea
                            id="product-about"
                            placeholder="Enter product about information"
                        />
                    </Field>
                    
                    <ProductSpecificationTable/>

                    <Field className={s.productImagesField}>
                        <FieldLabel htmlFor="product-images">
                            Product Images
                        </FieldLabel>

                        <FieldDescription>
                            Upload product images (you can upload up to 5 images)
                        </FieldDescription>

                        <FieldDescription>
                            These images will be appended to the last image in the variant.
                        </FieldDescription>

                        <ImageUploader
                            min={1}
                            accept={"image/jpeg, image/png"}
                            value={product_urls}
                            onChange={onChangeProductUrls}
                        />
                    </Field>

                    <ButtonGroup>
                        <ButtonGroup>
                            <Button type="submit" size={"sm"}>
                                Save Product
                            </Button>
                        </ButtonGroup>

                        <ButtonGroup>
                            <Button variant={"outline"} size={"sm"}>
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </ButtonGroup>

                </FieldGroup>
            </Form>
        </SellerContent>
    );
};

export default AddProduct;