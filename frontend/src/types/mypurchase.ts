export interface PurchaseHistory{
    orderID: string,
    
    productID:string,
    productName:string,
    
    storeID:string,
    storeName:string,
    productImage: string,

    amountPurchased: number,
    currency: string,
    discount? : number,
    price: number

    variantID: string
    sku: string
    nsin: string
    statusType:string
    status: string
}