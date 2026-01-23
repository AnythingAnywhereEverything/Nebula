import React, { useEffect, useState } from "react";
import style from "@styles/features/discoverypanel.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";
import { ProductItemExamples } from "src/mocks/productItem.mock";
import { ProductItem } from "src/types/productItem";
import NebulaProductItem from "@components/ui/NebulaProductItem";
import { useGridColumnCount } from "@components/utilities/UseGridColumnCount";

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
                <a href={"/moreDiscovery"} className={style.discoveryBtn} >More Discovery</a>
            </div>
        </section>
    )
}

export default DiscoveryProduct