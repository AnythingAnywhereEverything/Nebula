import { ProductItemExamples } from "@/mocks/productItem.mock";
import { useState, useEffect } from "react";
import * as ProductItemProps from "@/types/productItem";

import { useGridColumnCount } from "@lib/utils";
import { Badge } from "./badge";
import { ProductItem, ProductImage, ProductContent, ProductHeader, ProductFooter, ProductPrice, ProductStars, ProductLocation, Button, ButtonGroup } from "../NebulaUI";

import Link from "next/link";

import s from "@styles/ui/Nebula/productfield.module.scss";
import { cn } from "@/lib/utils";
import { ProductDatas } from "@/api/search";


type NebulaProductFieldProps = {
    max_rows?: number;
    item_display: ProductDatas[];
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
    item_display,
    ...props
} :React.ComponentProps<"ul"> &
    NebulaProductFieldProps) {

    const { containerRef, columnCount } = useGridColumnCount();
    const [products, setProducts] = useState<ProductDatas[]>([]);

    useEffect(() => {
        if (columnCount === 0) return;

        const visibleCount = columnCount * max_rows;

        if (max_rows < 1) {
            setProducts(
                Array.from(item_display)
            );
        }else {
            setProducts(
                Array.from(item_display ? item_display : ProductItemExamples ).slice(0, visibleCount)
            );
        }

    }, [columnCount, max_rows, item_display]);

    return (
        <ul className={s.productField} ref={containerRef}>
            {products.map((item) => (
                <li key={item.id}>
                    <ProductItem>
                        <ProductImage src={item.product_image}/>
                        <ProductContent>
                            <ProductHeader asChild>
                                <Link href={`/product/${item.id}/${encodeURIComponent(item.name)}`}>
                                    {item.name}
                                </Link>
                            </ProductHeader>
                            <ProductFooter>
                                <ProductPrice base={Number(item.price)}/>
                                <ProductStars stars={Number(item.rating)}/>
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
