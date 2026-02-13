import { Product } from "@/types/product";

export const productExample = {
    id: "123456",
    productStoreName: "Nebula",
    productStoreID: "4566897541",
    name: "JOYTOY 1/18 Warhammer 40,000 Action Figure Space Wolves Intercessors, Warhammer 40K, Collection Model 4.2inch",
    currency: "USD",
    rating: 4.5,
    reviewsCount: 120,
    soldAmount: 1254,
    section: "Electronic",
    category: "Household & Accessories",
    productTag: "Verified",
    productTagColor: "#2369ae",
    shippingCost: 0,
    options: [
        { 
            order: 1,
            name: "color", 
            values: ["Red", "Green", "Blue"] 
        },
        { 
            order: 2,
            name: "size", 
            values: ["S", "M", "L", "XL"] 
        }
    ],
    variants: [
        { 
            variantId: "var_001", 
            sku: "NEB-JOY-RED-S", 
            attributes: { color: "Red", size: "S" }, 
            price: 39.99, 
            discount: 29.99, 
            stock: 12, 
            availability: "in_stock", 
            nsin: "NB00000001", // NOTE: will be more complicate soon
            media: [
                "https://placehold.co/600x400/red/FFF",
                "https://placehold.co/400x400/lightblue/FFF",
                "https://placehold.co/500x500/FF5733/FFF",
                "https://placehold.co/450x300/33FF57/FFF",
                "https://placehold.co/300x450/3357FF/FFF",
                "https://placehold.co/400x400/aqua/FFF"
            ]
        },
        { 
            variantId: "var_002", 
            sku: "NEB-JOY-RED-M", 
            attributes: { color: "Red", size: "M" }, 
            price: 39.99, 
            discount: 29.99, 
            stock: 0, 
            availability: "out_of_stock", 
            nsin: "NB00000002",
            media: [
                "https://placehold.co/600x400/red/FFF",
                "https://placehold.co/400x400/white/FFF",
                "https://placehold.co/500x500/FF5733/FFF",
                "https://placehold.co/450x300/33FF57/FFF",
                "https://placehold.co/300x450/3357FF/FFF",
                "https://placehold.co/400x400/aqua/FFF"
            ]
        },
        { 
            variantId: "var_003", 
            sku: "NEB-JOY-GREEN-B", 
            attributes: { color: "Green", size: "L" }, 
            price: 39.99, 
            discount: 34.99, 
            stock: 4, 
            availability: "low_stock", 
            nsin: "NB00000003",
            media: [
                "https://placehold.co/600x400/green/FFF",
                "https://placehold.co/400x400/green/FFF",
                "https://placehold.co/500x500/gray/FFF",
                "https://placehold.co/450x300/33FF57/FFF",
                "https://placehold.co/300x450/3357FF/FFF",
                "https://placehold.co/400x400/aqua/FFF"
            ]
        },
        { 
            variantId: "var_004", 
            sku: "NEB-JOY-BMUE-S", 
            attributes: { color: "Blue", size: "S" }, 
            price: 39.99, 
            discount: 29.99, 
            stock: 7, 
            availability: "low_stock",
            nsin: "NB00000004",
            media: [
                "https://placehold.co/600x400/blue/FFF",
                "https://placehold.co/400x400/lightblue/FFF",
                "https://placehold.co/500x500/FF5733/FFF",
                "https://placehold.co/450x300/33FF57/FFF",
                "https://placehold.co/300x450/3357FF/FFF",
                "https://placehold.co/400x400/aqua/FFF"
            ]
        }
    ],
    productDetail: {
        specification: [
            { id: 1, name: "Brand", info: "Amazing brand" },
            { id: 2, name: "Quantity per pack", info: "1" }
        ],
        about: "# this is about of the *AMAZING **PRODUCT***\nand here come the new line??????\n### h3 testing!\nanddd maybe an image?\n\n![someimage](https://placehold.co/600x400)\n##### H5?\n maybe some [hyperlink to google?](https://google.com)\n # WHAT ABOUT A VERY VERY LONG ASS STRINGNGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG\n perhaps unsafe tag will do? <script>alert('XSS!');</script>"
    },
    warranty: 24
} as Product;
