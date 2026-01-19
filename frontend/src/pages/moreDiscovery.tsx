import React, { useEffect, useState } from "react";
import style from "@styles/layouts/moreDiscovery.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";
import { ProductItem, ProductWindow } from "@components/ui/ProductWindow";
import { NebulaButton } from "@components/ui/NebulaBtn";

// /page?=1


export default function MoreDiscovery(){
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    const itemPerPage = 8;
    useEffect(() => {
            fetch("/temp/fake.json")
            .then((res) => res.json())
            .then((data: ProductItem[]) => {
                setProducts(data);
            })
            .catch((err) => {
                console.error("Failed to fetch products: ", err)
            })
            .finally(() => {
                setLoading(false);
            });
        }, []);
        if (loading) {
            return <p>Loading product...</p>
        }

    return (
        <section className={style.moreDiscoverContainer}>
            
            <div className={style.moreDiscoverHeader}>
                <h2>
                    <NerdFonts>More Discovery</NerdFonts>
                </h2>
            </div>
            
            <div className={style.moreDiscoverMain}>
                <ul className={style.productList}>
                    
                    {products.map((item) => (
                        <ProductWindow
                        key={item.itemid}
                        items={[item]}
                        showInfo
                        />
                    ))}

                </ul>
            </div>

            <div className={style.pageNumber}>
                <NebulaButton
                    className={style.previousPage}
                    btnValues=" < "
                    onClick={() => {
                        // if (currentPage > 1 ){
                        //     setSearchParams({ Page: String(currentPage - 1) });
                        // }
                }}
                    relative
                />
                    <ul className={style.numberDisplay}>
                        <NebulaButton 
                        btnValues = "1"
                        className = {style.pageSelector}
                        onClick={() => {}}
                        />
                    </ul>
                    <NebulaButton
                    className={style.continuePage}
                    btnValues = " > "
                    onClick={() => {
                        // if (currentPage < totalPages){
                            //     setSearchParams({ Page: String(currentPage + 1) });
                            // }
                    }}
                relative
                />

            </div>
        </section>
    )
}