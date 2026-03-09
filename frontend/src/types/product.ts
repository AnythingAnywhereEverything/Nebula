export type ProductOption = {
    order: number;
    name: string;
    values: string[];
};

export interface ProductAttribute {
    id: string;
    name: string;
}

export interface AttributeOption {
    id: string;
    attribute_id: string;
    value: string;
}

export interface VariantValue {
    variant_id: string;
    attribute_option_id: string;
}

export type Specification = {
    id: string;
    key: string;
    value: string;
};


export interface ProductVariant {
    id: string;
    sku: string;
    price: string;
    salePrice: string | undefined;
    cost: string;
    onSale: boolean;
    stock: string;
    barcode: string | undefined;
    isEnabled: boolean;
}

export interface ProductImage {
    id: string;
    product_id: string | null;
    variant_id: string | null;
    image_url: string;
    position: number;
}

export type MatrixVariant = {
    id: string;
    key: string;
    attribute_option_ids: string[];
    values: Record<string, string>;
    isEnabled: boolean;
    stock: string;
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