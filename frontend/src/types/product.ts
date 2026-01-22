export type ProductOption = {
    order: number;
    name: string;
    values: string[];
};

export type ProductVariant = {
    variantId: string;
    sku: string;
    attributes: Record<string, string>;
    price: number;
    discount?: number;
    stock: number;
    nsin: string;
    media: string[];
    availability: "in_stock" | "out_of_stock" | "low_stock";
};

export type Product = {
    id: string;
    productStoreName: string;
    productStoreID: string;

    name: string;
    currency: string;

    rating: number;
    reviewsCount: number;
    soldAmount: number;

    section?: string;
    category?: string;

    productTag?: string;
    productTagColor?: string;

    shippingCost: number;
    warranty?: number;

    options?: ProductOption[];
    variants: ProductVariant[];

    productDetail: {
        specification?: { name: string; info: string }[];
        about: string;
    };
};
