import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import Head from 'next/head';

import ProductImageViewer from '@components/features/product/productImageViewer';
import ReactMarkdown from 'react-markdown';

import { productExample } from 'src/mocks/product.mock';
import ProductTitle from '@components/features/product/productTitle';
import ProductMinorDetail from '@components/features/product/productMinorDetails';
import ProductPrice from '@components/features/product/productPrice';
import ProductEssential from '@components/features/product/productEssential';
import ProductVariantSelector from '@components/features/product/productVariantSelector';
import ProductAmountSelector from '@components/features/product/productAmountSelector';
import ProductAction from '@components/features/product/productAction';
import ProductFullDetail from '@components/features/product/productFullDetail';

interface ProductPageLayoutProps {
    nsin?: string;
}

const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({nsin}) => {
    const product = productExample;

    if (!nsin || typeof nsin !== 'string') return;
    const variant = product.variants.find(v => v.nsin === nsin);

    if (!variant) return;


    return (
        <>
            <Head>
                <title>{product.name}</title>
            </Head>

            <div className={style.topSideContainer}>
                <ProductImageViewer mediaLists={variant.media}/>
                <div className={style.overallDetailContainer}>
                    <div className={style.topDetail}>
                        <ProductTitle 
                            name={product.name} 
                            tag={product.productTag} 
                            tag_color={product.productTagColor}/>

                        <a className={style.storeName} href={`/store/${product.productStoreID}`}>
                            Visit the {product.productStoreName} store
                        </a>

                        <ProductMinorDetail
                            rating={product.rating}
                            review={product.reviewsCount}
                            sold={product.soldAmount}/>

                        <ProductPrice
                            price={variant.price}
                            discount={variant.discount}/>
                    </div>

                    <div className={style.bottomDetail}>

                        {/* Product essential details e.g. Shipping/Coupons goes here */}
                        <ProductEssential
                            shippingCost={product.shippingCost}/>
                        
                        <ProductVariantSelector
                            variants={product.variants}
                            options={product.options}
                            prodName={product.name}
                            nsin={nsin}/>

                        <ProductAmountSelector
                            stock={variant.stock}
                            availability={variant.availability}
                            />
                        
                        <ProductAction nsin={nsin}/>
                    </div>
                </div>  
            </div>

            <div className={style.fullDetailContainer}>
                <ProductFullDetail
                    specs={product.productDetail.specification}
                    about={product.productDetail.about}/>
            </div>
        </>
    )

}

export default ProductPageLayout;