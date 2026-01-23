import React, { Reference, RefObject } from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import NebulaProductItem from "@components/ui/NebulaProductItem";
import cp from "@styles/ui/nebulaProductField.module.scss";
import { ProductItemExamples } from "src/mocks/productItem.mock";
import { useState, useEffect } from "react";
import { ProductItem } from "src/types/productItem";
import { useGridColumnCount } from "@components/utilities/UseGridColumnCount";

type NebulaProductFieldProps = {
    max_rows?: number;
    item_display?: ProductItem[];
}

const NebulaProductField: React.FC<NebulaProductFieldProps> = (props) => {
    const {
        max_rows,
        item_display
    } = props;

    const { containerRef, columnCount } = useGridColumnCount();
    const [products, setProducts] = useState<ProductItem[]>([]);

    useEffect(() => {
        if (columnCount === 0) return;

        const visibleCount = columnCount * (max_rows ? max_rows : 2);

        setProducts(
            Array.from(item_display ? item_display : ProductItemExamples ).slice(0, visibleCount)
        );
    }, [columnCount, props.max_rows]);

    return (
        <div className={cp.productList} ref={containerRef}>
            {products.map((item) => (
                <NebulaProductItem key={item.item_id} {...item} />
            ))}
        </div>
    );
};

export default NebulaProductField;
