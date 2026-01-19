import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';

import ProductImageViewer from '@components/features/product/productImageViewer';
import ProductOverall from '@components/features/product/productOverallDetail';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';

const ProductPageLayout: React.FC = () => {

    const router = useRouter();
    

    const productExample = {
        id: "123456", //query as string
        productStoreName: "Nebula",
        productStoreID: "4566897541",
        name: "This is the name of the item",
        price: 49.99,
        currency: "USD",
        availability: "In Stock",
        rating: 4.5,
        reviewsCount: 120,
        soldAmount: 1254,
        section: "Electronic",
        category: "Household & Accessories",
        productTag: "Verified",
        isFreeShipping: true,
        varients: [
            {
                varientTitle: "color",
                varients: ["Red", "Green", "Blue"]
            },
            {
                varientTitle: "size",
                varients: ["small", "large", "big"]
            }
        ],
        productDetail: {
            specification: [
                {
                    name: "brand",
                    info: "Amazing brand"
                },
                {
                    name: "Quantity per pack",
                    info: "1"
                }
            ],
            about: "# this is about of the *AMAZING **PRODUCT***\n and here come the new line??????"
        },
        productMedias: [
            "https://placehold.co/600x400/000000/FFF",
            "https://placehold.co/400x400/lightblue/FFF",
            "https://placehold.co/500x500/FF5733/FFF",
            "https://placehold.co/450x300/33FF57/FFF",
            "https://placehold.co/300x450/3357FF/FFF",
            "https://placehold.co/400x400/aqua/FFF",
        ],
        warranty: 24,
    }

    return (
        <>
            <div className={style.topSideContainer}>
                <ProductImageViewer
                    mediaLists={productExample.productMedias}
                />
                <ProductOverall
                    productTitle={productExample.name}
                    productVarient={productExample.varients}
                    storeName={productExample.productStoreName}
                    rating={productExample.rating}
                    soldAmount={productExample.soldAmount}
                    storeId={productExample.productStoreID}
                />
            </div>
            <div className={style.fullDetailContainer}>
                <ReactMarkdown>{productExample.productDetail.about}</ReactMarkdown>
            </div>
        </>
    )

}

export default ProductPageLayout;