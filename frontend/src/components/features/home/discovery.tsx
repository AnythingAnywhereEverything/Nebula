import { NebulaButton } from "@components/ui/NebulaBtn"
import React, { useEffect, useState } from "react";
import { ProductWindow } from "@components/ui/ProductWindow";
import style from "@styles/features/promotionpanel.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";
import { ProductItem } from "@components/ui/ProductWindow";
import { data } from "react-router-dom";
import Link from "next/link";

// Test fetch
const DiscoveryProduct: React.FC = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    return(
        <section className={style.discoverySection}>
            <div className={style.discoveryHeader}>
                <h2>
                    <NerdFonts>Discovery</NerdFonts>
                </h2>
            </div>

            <div  className={style.discoveryContainer}>
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

            <div className={style.moreDiscovery}>
                <Link href={"/moreDiscovery"} className={style.discoveryBtn} >More Discovery</Link>
            </div>
        </section>
    )
}

export default DiscoveryProduct