import { fetchWithAuth, getToken } from "@/handler/token_handler";
import {
    AttributeOption,
    ProductAttribute,
    ProductImage,
    ProductVariant,
    Specification,
    VariantRow,
    VariantValue,
} from "@/types/product";

export interface GetProductResponse {
    product: ProductResponse;
    attributes: ProductAttribute[];
    attribute_options: AttributeOption[];
    variant_values: VariantValue[];
    variants: ProductVariant[];
    specifications: Specification[];
    product_images: ProductImage[];
}

export interface GetVariantResponse {
    variant: ProductVariant;
    variant_images: ProductImage[];
}

export interface ProductResponse {
    id: string;
    shop_id: string;
    name: string;
    description: string;
    has_variants: boolean;
    is_active: boolean;
    free_shipping: boolean;
    deleted_at: string | null;
}

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
};

export type ProductData = {
    id: string;
    name: string;
    description: string;
    has_variant: boolean;
    is_active: boolean;
    free_shipping: boolean;

    image_url: string;
    variant_count: number;
    total_stock: number;

    created_at: string;
    updated_at: string;
    deleted_at: string;
};

export type UpdateProductInfo = {
    name: string;
    description: string;
    specifications: Specification[];
    images: {
        id: string | null
    }[]
    files: File[]
}

export type UpdateProductVariant = {
    attribute_options: string[],
    sku: string,
    price: string,
    salePrice: string | undefined,
    cost: string,
    onSale: boolean,
    stock: string,
    barcode: string | undefined,
    isEnabled: boolean,
    
    images: {
        id: string | null
    }[]
    files: File[]
}

export type CreateNewProductVariant = {
    attribute_options: string[],
    sku: string,
    price: string,
    salePrice: string | undefined,
    cost: string,
    onSale: boolean,
    stock: string,
    barcode: string | undefined,
    isEnabled: boolean,

    files: File[]
}

export const updateProductSetting = async (
    shop_id: string,
    product_id:string,
    data: {
        active: boolean,
        free_shipping: boolean
    }
) => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/product/${product_id}/settings`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
}


export const deleteProduct = async (
    shop_id: string,
    product_id:string,
) => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/product/${product_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export const updateProductVariant = async (
    shop_id:string,
    product_id:string,
    variant_id:string,
    data: UpdateProductVariant
) => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const formData = new FormData();
    
    const payload = {
        attribute_options: data.attribute_options,
        sku: data.sku,
        price: data.price,
        sale_price: data.salePrice,
        cost: data.cost,
        on_sale: data.onSale,
        stock: data.stock,
        barcode: data.barcode,
        images: data.images
    };

    formData.append("payload", JSON.stringify(payload));

    data.files.forEach((file) => {
        formData.append("images", file);
    });

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/product/${product_id}/variant/${variant_id}`, {
        method: "PUT",
        body: formData,
    })
    return;
}


export const createNewProductVariant = async (
    shop_id:string,
    product_id:string,
    data: CreateNewProductVariant
) => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const formData = new FormData();
    
    const payload = {
        attribute_options: data.attribute_options,
        sku: data.sku,
        price: data.price,
        sale_price: data.salePrice,
        cost: data.cost,
        on_sale: data.onSale,
        stock: data.stock,
        barcode: data.barcode
    };

    formData.append("payload", JSON.stringify(payload));

    data.files.forEach((file) => {
        formData.append("images", file);
    });

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/product/${product_id}/variant`, {
        method: "POST",
        body: formData,
    })
    return;
}


export const getProductVariant = async ( 
    shop_id:string,
    product_id:string,
    variant_id:string,
): Promise<GetVariantResponse> => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/product/${product_id}/variant/${variant_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
            data?.errors?.[0]?.message || "Failed to update Username";
        throw new Error(errorMessage);
    }

    return data;
}

export const updateProductInfo = async ( 
    shop_id : string,
    product_id:string,
    data: UpdateProductInfo
) => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const formData = new FormData();
    
    const payload = {
        name: data.name,
        description: data.description,
        specifications: data.specifications,
        images: data.images
    };

    formData.append("payload", JSON.stringify(payload));

    data.files.forEach((file) => {
        formData.append("images", file);
    });

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/product/${product_id}/info`, {
        method: "PATCH",
        body: formData,
    })
    return;
}


function buildProductFormData(product: FinalPayload) {
    const formData = new FormData();

    const payload = {
        ...product,
        images: undefined,
        variants: product.variants.map((v) => ({
            ...v,
            images: undefined,
        })),
    };

    formData.append("payload", JSON.stringify(payload));

    // product images
    product.images.forEach((file) => {
        formData.append("images", file);
    });

    // variant images (index-based mapping)
    product.variants.forEach((variant, index) => {
        variant.images.forEach((file) => {
            formData.append(`variant_images_${index}`, file);
        });
    });

    return formData;
}

export async function getShopProducts(shop_id: String): Promise<ProductData[]> {
    const res = await fetchWithAuth(`/api/v2/shops/${shop_id}/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
            data?.errors?.[0]?.message || "Failed to update Username";
        throw new Error(errorMessage);
    }

    return data;
}

export async function createProduct(payload: FinalPayload, shop_id: String) {
    const data = buildProductFormData(payload);

    const res = await fetchWithAuth(`/api/v2/products/${shop_id}/create`, {
        method: "POST",
        body: data,
    });
}

export async function getProductInfo(
    shop_id: String,
    product_id: String,
): Promise<GetProductResponse> {
    const res = await fetchWithAuth(
        `/api/v2/products/${shop_id}/product/${product_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
            data?.errors?.[0]?.message || "Failed to update Username";
        throw new Error(errorMessage);
    }

    return data;
}
