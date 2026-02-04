import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import Head from 'next/head';

import ProductImageViewer from '@components/features/product/productImageViewer';

import { productExample } from 'src/mocks/product.mock';
import ProductVariantSelector from '@components/features/product/productVariantSelector';
import ProductAmountSelector from '@components/features/product/productAmountSelector';
import ProductFullDetail from '@components/features/product/productFullDetail';
import { Badge } from '@components/ui/Nebula/badge';
import Link from 'next/link';
import { Button, Field, FieldDescription, FieldSeparator, FieldSet, Icon, Separator } from '@components/ui/NebulaUI';
import { formatLargeNumber, ratingStars } from '@lib/utils';
import ProductComment from '@components/features/product/productComment';

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

            <Field orientation={"horizontal"} className={style.container}>
                <ProductImageViewer mediaLists={variant.media}/>
                <FieldSeparator/>
                <FieldSet>
                    <Field>
                        <h2 className={style.productTitle}>
                            {(product.productTagColor && product.productTag) &&
                                <Badge color={product.productTagColor} size={"lg"}>{product.productTag}</Badge>
                            } 
                            {product.name}
                        </h2>
                        
                        <Link href={`/store/${product.productStoreID}`}>
                            Visit the {product.productStoreName} store
                        </Link>

                        <Field orientation={"horizontal"}>
                            <Field orientation={"horizontal"}>
                                <FieldDescription>
                                    {product.rating} <Icon className={style.star}>{ratingStars(product.rating)}</Icon>
                                </FieldDescription>
                                <Separator orientation="vertical" />
                                <FieldDescription title={product.reviewsCount.toString()}>
                                    {formatLargeNumber(product.reviewsCount)} Reviews
                                </FieldDescription>
                                <Separator orientation="vertical" />
                                <FieldDescription title={product.soldAmount.toString()}>
                                    {formatLargeNumber(product.soldAmount)} Sold
                                </FieldDescription>
                            </Field>
                            <Button variant={"destructive"} size={"sm"}>
                                Report
                            </Button>
                        </Field>

                        <div className={`${style.productPrice} ${variant.price ? style.discounted : ""}`}>
                            {variant.discount ? (
                                <>
                                    <p><span className={style.percent}>–{Math.round((1 - variant.discount / variant.price) * 100)}%</span> ${variant.discount}</p>
                                    <s>${variant.price}</s>
                                </>
                            ) : (
                                <p className={style.priceFocus}>${variant.price}</p>
                            )}
                        </div>
                            
                        <Separator orientation="horizontal" />
                    </Field>

                    <FieldSet>
                        
                        <div className={style.essentialContainer}>
                            <p className={style.essentialName}>Delivery</p>
                            <div className={style.detail}>
                                <Icon className={style.shipIcon}> </Icon>
                                {
                                    product.shippingCost !== 0 ? (
                                        <p>Total shipping cost ${product.shippingCost /* This is a placeholder, there will be no calculation on this project */}</p>
                                    ) : (
                                        <p>Free shipping</p>
                                    )
                                }
                            </div>
                        </div>
                        
                        <ProductVariantSelector
                            variants={product.variants}
                            options={product.options}
                            prodName={product.name}
                            nsin={nsin}/>

                        <ProductAmountSelector
                            stock={variant.stock}
                            availability={variant.availability}
                            />
                        
                        <Field orientation={"horizontal"} className={style.productAction}>
                            <Button className={style.addToCart}>
                                <Icon></Icon> Add to cart
                            </Button>

                            <Button className={style.buyNow}>
                                Buy Now
                            </Button>

                            <Button variant={"destructive"} className={style.wishList}>
                                <Icon></Icon>Add to wishlist
                            </Button>
                        </Field>
                    </FieldSet>
                </FieldSet>  
            </Field>

            <div className={style.fullDetailContainer}>
                <ProductFullDetail
                    specs={product.productDetail.specification}
                    about={product.productDetail.about}/>
            </div>

            <div className={style.commentContainer}>
                <ProductComment />
            </div>
        </>
    )

}

export default ProductPageLayout;