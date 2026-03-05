import { SellerContent } from "@components/layouts/sellerPageLayout";
import ImageUploader from "@components/ui/Nebula/image-uploader";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    Input,
    Textarea,
} from "@components/ui/NebulaUI";
import ProductSpecificationTable, { Specification } from "./specTable";
import s from "@styles/layouts/seller/addProduct.module.scss";

import { useRef, useState } from "react";

const NAME_MIN = 20;
const NAME_MAX = 255;
const DESC_MAX = 2000;
const MAX_IMAGES = 5;

export const AddProductHeader: React.FC<{
    data: {
        name: string;
        description: string;
        images: (File | string)[];
    };
    onChange: (
        patch: Partial<{
            name: string;
            description: string;
            images: (File | string)[];
        }>
    ) => void;
    specifications: Specification[];
    onSpecChange: (specs: Specification[]) => void;
}> = ({ data, onChange, specifications, onSpecChange }) => {

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        images: ""
    });

    const validateTimer = useRef<NodeJS.Timeout | null>(null);

    const handleName = (value: string) => {
        onChange({ name: value }); // * update UI immediately so undo stack works

        if (validateTimer.current) {
            clearTimeout(validateTimer.current);
        }

        validateTimer.current = setTimeout(() => {
            const trimmed = value.trim();
            let error = "";

            if (trimmed.length === 0) {
                error = "Product name is required";
            } else if (trimmed.length < NAME_MIN) {
                error = `Min ${NAME_MIN} characters`;
            } else if (trimmed.length > NAME_MAX) {
                error = `Max ${NAME_MAX} characters`;
            }

            setErrors(e => ({ ...e, name: error }));
        }, 50);
    };

    const handleDescription = (value: string) => {
        onChange({ description: value }); // * same fix

        if (validateTimer.current) {
            clearTimeout(validateTimer.current);
        }

        validateTimer.current = setTimeout(() => {
            let error = "";

            if (value.length > DESC_MAX) {
                error = `Max ${DESC_MAX} characters`;
            }

            setErrors(e => ({ ...e, description: error }));
        }, 50);
    };
    
    return (
        <SellerContent>
            <FieldGroup>
                <FieldLegend style={{ margin: 0 }}>
                    Product Information
                </FieldLegend>

                <FieldSeparator />

                <Field>
                    <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
                    <Input
                        id="product-name"
                        className={s.input}
                        value={data.name}
                        onChange={(e) => handleName(e.target.value)}
                    />
                    {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="product-about">About product</FieldLabel>
                    <FieldDescription>
                        Enter detailed information about the product.
                    </FieldDescription>

                    <Textarea
                        data-invalid = {errors.description}
                        id="product-about"
                        className={s.textarea}
                        value={data.description}
                        onChange={(e) => handleDescription(e.target.value)}
                    />

                    {errors.description && (
                        <FieldError>{errors.description}</FieldError>
                    )}
                </Field>

                <ProductSpecificationTable
                    value={specifications}
                    onChange={onSpecChange}
                />

                <Field className={s.productImagesField}>
                    <FieldLabel htmlFor="product-images">
                        Product Images
                    </FieldLabel>

                    <FieldDescription>
                        Upload up to 5 images.
                    </FieldDescription>

                    <ImageUploader
                        id="product-images"
                        min={1}
                        accept="image/jpeg, image/png"
                        value={data.images}
                        onChange={(images) => onChange({ images })}
                    />

                    {errors.images && (
                        <FieldError>{errors.images}</FieldError>
                    )}
                </Field>
            </FieldGroup>
        </SellerContent>
    );
};