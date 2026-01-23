import { useEffect, useState, useRef } from "react";

export const useGridColumnCount = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [columnCount, setColumnCount] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const el = containerRef.current;

        const calculateColumns = () => {
            const computedStyle = window.getComputedStyle(el);
            const columns = computedStyle
                .gridTemplateColumns
                .split(" ")
                .filter(Boolean).length;

            setColumnCount(columns);
        };

        calculateColumns();

        const observer = new ResizeObserver(calculateColumns);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return { containerRef, columnCount };
};