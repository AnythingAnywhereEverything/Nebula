import { Product } from "@/types/product"

export type QueryProductValues = {
    id: string,
    name : string,
    shop_id: string
}

export type ProductDatas = {
    id: string,
    name: string,
    rating: string,
    product_image: string,
    price: string,
    on_sale: boolean,
    sale_price: string | undefined
}

export type ProductSearchResponse = {
    data: ProductDatas[]
    page: number
    total_pages: number
}

export const searchOnType = async(q: string): Promise<QueryProductValues[]> => {
    const res = await fetch(`/api/v2/search/product?q=${q}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }

    return data;
}

export const searchProductDatas = async(
    q: string,
    page?: string | null,
    limit?: string | null
): Promise<ProductSearchResponse> => {

    const params = new URLSearchParams();

    if (q.trim()) params.append("q", q);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    const res = await fetch(
        `/api/v2/search/product_data?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
            data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }

    const prefix = "/cdn/";

    return {
        ...data,
        data: data.data.map((item: ProductDatas) => ({
            ...item,
            product_image: prefix + item.product_image
        }))
    };
}

export const getProductViaVariantId = async(variant_id: string): Promise<Product> => {
    const res = await fetch(`/api/v2/search/product/${variant_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }

    return data;
}
