export type ProductItem = {
    item_id: string | number;
    nsin: string;

    itemtag?: string;
    itemtagcolor?: string;

    itemtitle: string;
    itemimageurl: string;
    itemprice_usd: number;
    itemrating: number;
    productLocation: string;
}