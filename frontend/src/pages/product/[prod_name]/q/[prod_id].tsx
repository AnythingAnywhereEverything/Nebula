// frontend/src/pages/product/[prod_name]/q/[prod_id].tsx
import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductPageLayout from '@components/layouts/productPageLayout';

export default function ProductPage() {
    const router = useRouter();
    
    const prodName = router.query.prod_name;
    const prodId = router.query.prod_id;
    
    return (
        <div className={style.productContainer}>
            <Head>
                <title>{prodName}</title>
            </Head>

            <ProductPageLayout/>
        </div>
    );
}