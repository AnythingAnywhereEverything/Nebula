// frontend/src/pages/product/[prod_name]/q/[prod_id].tsx
import React, { useEffect } from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductPageLayout from '@components/layouts/productPageLayout';

export default function ProductPage() {
    const router = useRouter();

    const { variant_id, prod_name } = router.query;

    useEffect(() => {
        if (!router.isReady) return;

        console.log(variant_id);
    }, [router.isReady, variant_id]);

    if (!router.isReady) return null;

    if (typeof variant_id !== "string") return null;

    
    return (
        <div className={style.productContainer}>
            <ProductPageLayout variant_id={variant_id}/>
        </div>
    );
}