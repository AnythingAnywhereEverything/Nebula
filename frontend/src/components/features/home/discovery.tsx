import React, { useEffect, useState } from "react";
import style from "@styles/features/discoverypanel.module.scss"
import { ProductItemExamples } from "src/mocks/productItem.mock";
import { ProductItem } from "src/types/productItem";
import NebulaProductItem from "@components/ui/NebulaProductItem";
import { useGridColumnCount } from "@components/utilities/UseGridColumnCount";
import Link from "next/link";

// Test fetch
const DiscoveryProduct: React.FC = () => {
    const { containerRef, columnCount } = useGridColumnCount();
    const [products, setProducts] = useState<ProductItem[]>([]);

    useEffect(() => {
        if (columnCount === 0) return;

        const visibleCount = columnCount * 3;

        setProducts(
            Array.from(ProductItemExamples).slice(0, visibleCount)
        );
    }, [columnCount]);
    
    return(
        <section className={style.discoverySection}>
            <h2 className={style.discoveryHeader}>
                Discovery
            </h2>

            <div className={style.productList} ref={containerRef}>
                {products.map((item) => (
                    <NebulaProductItem key={item.item_id} {...item}/>
                ))}
            </div>

            <div className={style.moreDiscovery}>
                <Link href={"/discovery"} className={style.discoveryBtn} >More Discovery</Link>
            </div>
        </section>
    )
}

export default DiscoveryProduct