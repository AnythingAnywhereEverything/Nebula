import React, { useRef } from "react";
import Link from "next/link";
import { Button, Field, FieldLegend, Icon } from "@components/ui/NebulaUI";
import s from "@styles/home.module.scss";

const ITEM_WIDTH = 114;
const GAP = 16;

const CategoryItem: React.FC = () => {
    return (
        <li>
            <Link href="#">
                <img src="https://placehold.co/96" alt="" />
                <FieldLegend>Shirt & Shoe :D</FieldLegend>
            </Link>
        </li>
    );
};

const CategoryPanel: React.FC = () => {
    const listRef = useRef<HTMLUListElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!listRef.current) return;

        const amount = (ITEM_WIDTH + GAP) * 5;
        listRef.current.scrollBy({
            left: direction === "right" ? amount : -amount,
            behavior: "smooth",
        });
    };

    return (
        <Field style={{ padding: "calc(var(--spacing) * 2)" }}>
            <h1>Categories</h1>

            <Field
                style={{
                    padding: "calc(var(--spacing) * 1)",
                    position: "relative",
                    display: "grid",
                }}
            >
                <Field
                    orientation={"horizontal"}
                    style={{
                        justifyContent: "space-between",
                        gridArea: "1 / 1",
                        zIndex: "10",
                        paddingInline: "var(--spacing)",
                        pointerEvents: "none"
                    }}
                >
                    <Button
                        variant={"secondary"}
                        onClick={() => scroll("left")}
                        className={s.carouselBtnLeft}
                    >
                        <Icon></Icon>
                    </Button>

                    <Button
                        variant={"secondary"}
                        onClick={() => scroll("right")}
                        className={s.carouselBtnRight}
                    >
                        <Icon></Icon>
                    </Button>
                </Field>

                <ul ref={listRef} className={s.categoryUl}style={{
                        gridArea: "1 / 1",
                    }}>
                    {Array.from({ length: 35 }).map((_, i) => (
                        <CategoryItem key={i} />
                    ))}
                </ul>
            </Field>
        </Field>
    );
};

export default CategoryPanel;
