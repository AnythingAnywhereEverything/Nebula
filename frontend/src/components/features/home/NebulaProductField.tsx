import React from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import NebulaProductItem from "@components/ui/NebulaProductItem";
import cp from "@styles/features/selectorSearch.module.scss";
import { ProductItemExamples } from "src/mocks/productItem.mock";
import { useState, useEffect } from "react";
import { ProductItem } from "src/types/productItem";
import { useGridColumnCount } from "@components/utilities/UseGridColumnCount";

type BaseProps = {
    title: string;
    max_rows?: number;
    min_price?: number;
    max_price?: number;
}

type AlterSelectorLinkProps = BaseProps & {
    type: 'customLink';
    text: string;
    link: string;
}

type ShowMoreButtonProps = BaseProps & {
    type: 'showMore';
    recommend: string;
}

type SelectorSearchProps = AlterSelectorLinkProps | ShowMoreButtonProps;

const SelectorSearch: React.FC<SelectorSearchProps> = (props) => {
    // Destructure common props here
    const {
        title,
        max_rows,
        min_price,
        max_price
    } = props;

    const { containerRef, columnCount } = useGridColumnCount();
    const [products, setProducts] = useState<ProductItem[]>([]);

    useEffect(() => {
        if (columnCount === 0) return;

        const visibleCount = columnCount * (max_rows ? max_rows : 2);

        setProducts(
            Array.from(ProductItemExamples).slice(0, visibleCount)
        );
    }, [columnCount, props.max_rows]);

    let buttonHref: string;
    let buttonText: string;

    if (props.type === 'customLink') {
        buttonHref = props.link;
        buttonText = props.text;
    } else {
        const recommendQuery = props.recommend ? `q=${encodeURIComponent(props.recommend)}` : "";
        const minPriceQuery = min_price !== undefined ? `&min_price=${min_price}` : "";
        const maxPriceQuery = max_price !== undefined ? `&max_price=${max_price}` : "";

        buttonHref = `/search?${recommendQuery}${minPriceQuery}${maxPriceQuery}`;
        buttonText = "Show more";
    }
    
    return (
        <section className={cp.selectorContainer}>
            <header className={cp.selectorHeader}>
                <h2 className={cp.title}>{title}</h2>
                <NebulaButton
                    href={buttonHref}
                    className={cp.showMoreButton}
                    btnValues={buttonText}
                />
            </header>

            <div className={cp.productList} ref={containerRef}>
                {products.map((item) => (
                    <NebulaProductItem key={item.item_id} {...item} />
                ))}
            </div>
        </section>
    );
};

export default SelectorSearch;
