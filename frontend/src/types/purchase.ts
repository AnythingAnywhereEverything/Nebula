import { ProductVariant } from "./product"

export interface IPurchase {
    itemID: string;
    status: string;
    
    productStoreName: string;
    productStoreID: string;

    itemTitle: string;
    itemImageURL: string;

    currency: string;
    
    broughtAmount: number;
    variants: ProductVariant[];
}