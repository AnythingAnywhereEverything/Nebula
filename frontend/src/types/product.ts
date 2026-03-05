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
        specification?: { id:number, name: string; info: string }[];
        about: string;
    };
};

export type AttributePayload = {
    name: string;
    options: string[];
};

export type ProductVariantPayload = {
    sku: string;
    price: number;
    sale_price?: number;
    on_sale: boolean;
    stock_quantity: number;
    barcode?: string;
    attributes: {
        name: string;
        value: string;
    }[];
};

export type PreparedProductPayload = {
    has_variants: boolean;
    attributes: AttributePayload[];
    variants: ProductVariantPayload[];
};

export type VariantRow = {
    id: string;
    values: Record<string, string>;

    isEnabled: boolean; // * important

    sku: string;
    price: string;
    cost: string;
    salePrice?: string;
    onSale: boolean;
    stock: string;
    barcode?: string;

    images: (File | string)[];
};

export type ProductInfo = {
    name:string,
    description:string,
    images: (File | string)[]
}