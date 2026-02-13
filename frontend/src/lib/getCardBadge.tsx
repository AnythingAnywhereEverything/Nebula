import { Field } from "@components/ui/NebulaUI";
import s from "@styles/layouts/payment.module.scss";
import { creditCardType } from "card-validator";

import Image, { ImageProps } from "next/image";
import { acceptCards } from "@/constants/validCards";
import { cn } from "./utils";

interface CardBadgeProps extends Omit<
    ImageProps,
    "src" | "alt" | "width" | "height"
> {
    cardType: string;
    scale?: number;
    border?: boolean;
}

export function CardBadge({
    cardType,
    scale = 1,
    border = true,
    ...props
}: CardBadgeProps) {
    const cardIcon = acceptCards.find((card) => card.type === cardType);

    const [w, h] = [32 * scale, 22 * scale];

    return (
        <>
            {cardIcon ? (
                <Image
                    className={cn(s.card, border && s.border)}
                    width={w}
                    height={h}
                    src={cardIcon.icon}
                    alt={creditCardType.getTypeInfo(cardIcon.type).niceType}
                    {...props}
                />
            ) : (
                <Image
                    className={cn(s.card)}
                    width={w}
                    height={h}
                    src="/icons/payments/unknown_symbol.svg"
                    alt="Unknown"
                    {...props}
                />
            )}
        </>
    );
}
