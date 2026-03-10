import React, { useEffect, useState } from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import Head from 'next/head';

import ProductImageViewer from '@components/features/product/productImageViewer';

import ProductVariantSelector from '@components/features/product/productVariantSelector';
import ProductAmountSelector from '@components/features/product/productAmountSelector';
import ProductFullDetail from '@components/features/product/productFullDetail';
import { Badge } from '@components/ui/Nebula/badge';
import Link from 'next/link';
import { Button, Field, FieldDescription, FieldSeparator, FieldSet, Icon, Separator } from '@components/ui/NebulaUI';
import { formatLargeNumber, ratingStars } from '@lib/utils';
import ProductComment from '@components/features/product/productComment';
import { getProductViaVariantId } from '@/api/search';
import { Product } from '@/types/product';

interface ProductPageLayoutProps {
    variant_id?: string;
}



const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({variant_id}) => {
    const [product, setProduct] = useState<Product>()

    useEffect(() => {
        if (!variant_id) return;

        const load = async () => {
            const data = await getProductViaVariantId(variant_id)
            setProduct(data)
            console.log(data)
        }
        load()
    }, [variant_id])

    if (!product) return;

    if (!variant_id || typeof variant_id !== 'string') return;
    const variant = product.variants.find(v => v.id === variant_id);

    return (
        <>
            <Head>
                <title>{product.name}</title>
            </Head>

            <Field orientation={"horizontal"} className={style.container}>
                <ProductImageViewer mediaLists={variant?.images || []}/>
                <FieldSeparator/>
                <FieldSet>
                    <Field>
                        <h2 className={style.productTitle}>
                            {product.name}
                        </h2>
                        
                        <Link href={`/store/${product.store_id}`}>
                            Visit the {product.store_name} store
                        </Link>

                        <Field orientation={"horizontal"}>
                            <Field orientation={"horizontal"}>
                                <FieldDescription>
                                    {product.rating} <Icon className={style.star}>{ratingStars(Number(product.rating))}</Icon>
                                </FieldDescription>
                                <Separator orientation="vertical" />
                                <FieldDescription title={product.review_amount.toString()}>
                                    {formatLargeNumber(Number(product.review_amount))} Reviews
                                </FieldDescription>
                                <Separator orientation="vertical" />
                                <FieldDescription title={product.sold.toString()}>
                                    {formatLargeNumber(Number(product.sold))} Sold
                                </FieldDescription>
                            </Field>
                            <Button variant={"destructive"} size={"sm"}>
                                Report
                            </Button>
                        </Field>

                        <div className={`${style.productPrice} ${variant?.price ? style.discounted : ""}`}>
                            {variant?.on_sale ? (
                                <>
                                    <p><span className={style.percent}>–{Math.round((1 - Number(variant?.sale_price) / Number(variant?.price)) * 100)}%</span> ${variant.sale_price}</p>
                                    <s>${variant.price}</s>
                                </>
                            ) : (
                                <p className={style.priceFocus}>${variant?.price}</p>
                            )}
                        </div>
                            
                        <Separator orientation="horizontal" />
                    </Field>

                    <FieldSet>
                        
                        <div className={style.essentialContainer}>
                            <p className={style.essentialName}>Delivery</p>
                            <div className={style.detail}>
                                {
                                    product.free_shipping &&
                                    <>
                                    <Icon className={style.shipIcon}> </Icon>
                                    <p>Free shipping</p>
                                    </>
                                }
                            </div>
                        </div>
                        
                        <ProductVariantSelector
                            variants={product.variants}
                            options={product.options}
                            prodName={product.name}
                            variant_id={variant_id}/>

                        <ProductAmountSelector
                            stock={variant?.stock || "0"}
                            availability={
                                Number(variant?.stock) <= 0 ?
                                "out_of_stock":
                                Number(variant?.stock) <= 10 ?
                                "low_stock":
                                "in_stock"
                            }
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
                    specs={product.specification}
                    about={product.description}/>
            </div>

            <div className={style.commentContainer}>
                <ProductComment product_id={product.id} />
            </div>
        </>
    )

}

export default ProductPageLayout;