import React from "react";
import style from "@styles/layouts/payment.module.scss";
import { CardInfo } from "@/types/card";
import {
    Button,
    ButtonGroup,
    Field,
    FieldLabel,
} from "@components/ui/NebulaUI";

import { CardBadge } from "@lib/getCardBadge";
import { creditCardType } from "card-validator";
import { Badge } from "@components/ui/Nebula/badge";

const LoadCard: React.FC<CardInfo> = ({
    card_type,
    last_four_digits,
    expireDate,
    is_default,
}) => {
    const year = expireDate.getFullYear();
    const month = String(expireDate.getMonth() + 1).padStart(2, "0");

    return (
        <Field orientation={"horizontal"} className={style.cardContainer}>
            <Field orientation={"horizontal"}>
                <CardBadge scale={1.5} cardType={card_type} />
                <Field>
                    <FieldLabel>
                        {creditCardType.getTypeInfo(card_type)?.niceType ??
                            "Unknown"}
                        : {last_four_digits}
                    </FieldLabel>
                    {is_default && (
                        <Badge
                            color="color-mix(in oklab, var(--primary) 80%, transparent)"
                            size={"sm"}
                            className={style.badge}
                        >
                            Default
                        </Badge>
                    )}
                </Field>
            </Field>

            <ButtonGroup orientation={"horizontal"}>
                <ButtonGroup>
                    <Button variant={"destructive"} size={"sm"}>
                        Delete
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        variant={"secondary"}
                        size={"sm"}
                        disabled={is_default}
                    >
                        Set as Default
                    </Button>
                </ButtonGroup>
            </ButtonGroup>
        </Field>
    );
};

export default LoadCard;
