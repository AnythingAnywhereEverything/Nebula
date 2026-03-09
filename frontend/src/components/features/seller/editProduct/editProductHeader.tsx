import { SellerContent } from "@components/layouts/sellerPageLayout";
import ImageUploader from "@components/ui/Nebula/image-uploader";
import {
    Button,
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
import EditProductSpecificationTable, { Specification } from "./editSpecTable";
import s from "@styles/layouts/seller/addProduct.module.scss";

import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/types/product";
import { updateProductInfo } from "@/api/product";
import { useRouter } from "next/navigation";

const NAME_MIN = 10;
const NAME_MAX = 255;
const DESC_MAX = 2000;

type HeaderProp = {
    name: string;
    description: string;
    specifications: Specification[];
}

type ImgPrepared = ProductImage & { file: File | null }

export const EditProductHeader: React.FC<{
    data: HeaderProp,
    images: ProductImage[]
    product_id: string,
    shop_id: string,
}> = ({ data, product_id, images, shop_id }) => {
    const router = useRouter()

    const base = {
        name: "",
        description: "",
        specifications: []
    }

    const [oldImages, setOldImages] = useState<ProductImage[]>([]);
    const [imgPrepare, setImgPrepare] = useState<ImgPrepared[]>([])

    const [old, setOld] = useState<HeaderProp>(base);
    const [draft, setDraft] = useState<HeaderProp>(base);
    
    useEffect(() => {
        setOld(data)
        setDraft(data)
        setOldImages(images)
        setImgPrepare(
            images.map(i => ({
                ...i,
                file: null
            }))
        )
    }, [data])

    const onSubmit = async () => {
        const images = imgPrepare.map((v) => ({
            id: v.id !== "" ? v.id : null
        }))

        const files = imgPrepare
            .map(v => v.file)
            .filter((file): file is File => file !== null)
    
        const prepareData = {
            name: draft.name,
            description: draft.description,
            specifications: draft.specifications,
            images: images,
            files: files
        }

        await updateProductInfo(shop_id, product_id, prepareData)
        router.refresh()
    }

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
                        product_id,
                        image_url: v,
                        position: index,
                        file: null
                    } as ImgPrepared;
                }

                return {
                    id: "",
                    product_id,
                    image_url: "",
                    position: index,
                    file: v
                } as ImgPrepared;
            });
        });
    };

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        images: ""
    });

    const validateTimer = useRef<NodeJS.Timeout | null>(null);

    const handleName = (value: string) => {
        setDraft(p => ({ ...p, name: value }));

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

    const isDataDifferent = () => {
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


    const handleDescription = (value: string) => {
        setDraft(p => ({ ...p, description: value }));

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
                <Field orientation={"horizontal"} justify={"space-between"}>
                    <FieldLegend style={{ margin: 0 }}>
                        Product Information
                    </FieldLegend>
                    <Button onClick={onSubmit} size={"sm"} disabled={!isDataDifferent()}>
                        Save Information
                    </Button>
                </Field>

                <FieldSeparator />

                <Field data-invalid={errors.name !== ""}>
                    <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
                    <Input
                        id="product-name"
                        className={s.input}
                        value={draft.name}
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
                        value={draft.description}
                        onChange={(e) => handleDescription(e.target.value)}
                    />

                    {errors.description && (
                        <FieldError>{errors.description}</FieldError>
                    )}
                </Field>

                <EditProductSpecificationTable
                    value={draft.specifications}
                    onChange={ value => setDraft(p => ({ ...p, specifications: value }))}
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
                        value={[...imgPrepare]
                            .sort((a, b) => a.position - b.position)
                            .map(i => i.image_url !== "" ? i.image_url : (i.file ?? ""))}
                        onChange={handleImageChange}
                    />

                    {errors.images && (
                        <FieldError>{errors.images}</FieldError>
                    )}
                </Field>
            </FieldGroup>
        </SellerContent>
    );
};