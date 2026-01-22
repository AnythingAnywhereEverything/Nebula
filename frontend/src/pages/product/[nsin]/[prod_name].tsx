// frontend/src/pages/product/[prod_name]/q/[prod_id].tsx
import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductPageLayout from '@components/layouts/productPageLayout';

export default function ProductPage() {
    const router = useRouter();
    
    const nsin = Array.isArray(router.query.nsin) ? router.query.nsin[0] : router.query.nsin;
    
    console.log(nsin)

    return (
        <div className={style.productContainer}>
            <ProductPageLayout nsin={nsin}/>
        </div>
    );
}