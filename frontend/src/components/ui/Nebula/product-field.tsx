import { ProductItemExamples } from "src/mocks/productItem.mock";
import { useState, useEffect } from "react";
import * as ProductItemProps from "src/types/productItem";

import { useGridColumnCount } from "@components/utilities/UseGridColumnCount";
import { Badge } from "./badge";
import { ProductItem, ProductImage, ProductContent, ProductHeader, ProductFooter, ProductPrice, ProductStars, ProductLocation, Button, ButtonGroup } from "../NebulaUI";

import Link from "next/link";

import s from "@styles/ui/Nebula/productfield.module.scss";
import { cn } from "src/lib/utils";


type NebulaProductFieldProps = {
    max_rows?: number;
    item_display?: ProductItemProps.ProductItem[];
}

function ProductContainer({
    className,
    ...props
}:  React.ComponentProps<"section">) {
    return <section className={cn(s.productContainer, className)} {...props} />
}

function ProductContainerHeader ({
    className,
    ...props
}:  React.ComponentProps<"header">) {
    return <header className={cn(s.containerHeader, className)} {...props} />
}

function ProductContainerHeaderGroup ({
    className,
    ...props
}:  React.ComponentProps<"div">) {
    return <header className={cn(s.containerHeaderGroup, className)} {...props} />
}

function ProductContainerHeaderAddon ({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div className={cn(s.containerHeaderAddon, className)} {...props} />
}

function ProductContainerTitle ({
    className,
    ...props
}:  React.ComponentProps<"h1">) {
    return <h1 className={cn(s.containerTitle, className)} {...props} />
}

function ProductContainerDescription ({
    className,
    ...props
}:  React.ComponentProps<"p">) {
    return <p className={cn(s.containerDescription, className)} {...props} />
}

function ProductField({
    className,
    max_rows = 2,
    item_display = ProductItemExamples,
    ...props
} :React.ComponentProps<"ul"> &
    NebulaProductFieldProps) {

    const { containerRef, columnCount } = useGridColumnCount();
    const [products, setProducts] = useState<ProductItemProps.ProductItem[]>([]);

    useEffect(() => {
        if (columnCount === 0) return;

        const visibleCount = columnCount * max_rows;

        setProducts(
            Array.from(item_display ? item_display : ProductItemExamples ).slice(0, visibleCount)
        );
    }, [columnCount, max_rows]);

    return (
        <ul className={s.productField} ref={containerRef}>
            {products.map((item) => (
                <li>
                    <ProductItem>
                        <ProductImage src={item.itemimageurl}/>
                        <ProductContent>
                            <ProductHeader asChild>
                                <Link href={`/product/${item.nsin}/${encodeURIComponent(item.itemtitle)}`}>
                                    {(item.itemtagcolor && item.itemtag) &&
                                        <Badge color={item.itemtagcolor} size={"xs"}>{item.itemtag}</Badge>
                                    }
                                    {item.itemtitle}
                                </Link>
                            </ProductHeader>
                            <ProductFooter>
                                <ProductPrice base={item.itemprice_usd}/>
                                <ProductStars stars={item.itemrating}/>
                                <ProductLocation location={item.productLocation}/>
                            </ProductFooter>
                        </ProductContent>
                    </ProductItem>
                </li>
            ))}
        </ul>
    );
};

export {
    ProductField,
    ProductContainer,
    ProductContainerDescription,
    ProductContainerHeader,
    ProductContainerHeaderAddon,
    ProductContainerTitle,
    ProductContainerHeaderGroup
};
