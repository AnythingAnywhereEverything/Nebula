import { PurchaseHistory } from "@/types/mypurchase";

export const PurchaseItems: PurchaseHistory[] = [
    {
        orderID: "WASD1",

        productID:"123456",
        productName:"JOYTOY 1/18 Warhammer 40,000 Action Figure Space Wolves Intercessors, Warhammer 40K, Collection Model 4.2inch",
        productImage: "https://placehold.co/200",

        storeID: "4566897541",
        storeName: "Nebula Store",

        amountPurchased: 2,
        currency: "USD",

        variantID: "var_001",
        sku: "NEB-JOY-RED-S",
        nsin: "NB00000001",

        statusType: "completed",
        status: "Completed",
        price: 1200,
        discount:29.99
    },
    {
        orderID: "WASD2",

        productID:"234123",
        productName:"Gaming chair, Collection Model 4.2inch",
        productImage: "https://placehold.co/200",

        storeID: "4566897541",
        storeName: "Chair Store",

        amountPurchased: 6,
        currency: "USD",

        variantID: "var_001",
        sku: "CHAIR-RED-S",
        nsin: "NB00000001",
        statusType: "toship",
        status: "To ship",
        price: 125,
    },
]