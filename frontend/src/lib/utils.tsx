import { useEffect, useRef, useState } from "react";

export function cn(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(" ")
}

export const useGridColumnCount = () => {
    const containerRef = useRef<HTMLUListElement | null>(null);
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

export const formatLargeNumber = (num:number|bigint) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num);
}

export const ratingStars = (itemrating:number) => {
    const stars = [];
    for (let i = 0; i < Math.floor(itemrating); i++) {
        stars.push("");
    }
    if (itemrating % 1 > 0) {
        stars.push("");
    }
    for (let i = stars.length; i < 5; i++) {
        stars.push("");
    }
    return stars.join("");
}

export function formatPhoneByCountry(digits: string, countryCode: string) {
    const numbers = digits.replace(/\D/g, "");

    if (!countryCode) return numbers;

    if (countryCode === "1") {
        const area = numbers.slice(0, 3);
        const mid = numbers.slice(3, 6);
        const last = numbers.slice(6, 10);

        let formatted = "+1";
        if (area) formatted += ` (${area}`;
        if (area.length === 3) formatted += `)`;
        if (mid) formatted += ` ${mid}`;
        if (last) formatted += `-${last}`;
        return formatted;
    }

    return `+${countryCode} ${numbers}`;
}
