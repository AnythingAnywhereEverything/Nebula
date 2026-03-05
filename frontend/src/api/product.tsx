import { fetchWithAuth } from "@/handler/token_handler";
import { VariantRow } from "@/types/product";

export type Specification = {
    id: string;
    key: string;
    value: string;
};

export type FinalPayload = {
    hasVariant: boolean;
    variants: VariantRow[];
    specifications: Specification[];
    isActive: boolean;
    freeShipping: boolean;
    category: string;
    shopCategory: string;
    name: string;
    description: string;
    images: (File | string)[];
}

function buildProductFormData(product: FinalPayload) {
    const formData = new FormData()

    const payload = {
        ...product,
        images: undefined,
        variants: product.variants.map(v => ({
            ...v,
            images: undefined
        }))
    }

    console.log(payload)

    formData.append("payload", JSON.stringify(payload))

    // product images
    product.images.forEach(file => {
        formData.append("images", file)
    })

    // variant images (index-based mapping)
    product.variants.forEach((variant, index) => {
        variant.images.forEach(file => {
            formData.append(`variant_images_${index}`, file)
        })
    })

    return formData
}

export async function createProduct(payload: FinalPayload, shop_id: String) {
    const data = buildProductFormData(payload);

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/create`, {
        method: "POST",
        body: data
    })

    const text = await res.text();
    console.log(text) // * incase no data returning
}