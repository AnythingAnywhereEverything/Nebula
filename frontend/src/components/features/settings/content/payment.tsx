import React from "react";
import style from "@styles/layouts/payment.module.scss";
import LoadCard from "../payment/hasCard";
import { noCard, hasCard } from "@/mocks/card.mock";
import {
    Field,
    FieldGroup,
} from "@components/ui/NebulaUI";
import AddPaymentMethod from "../payment/addPaymentBtn";

const Payment: React.FC = () => {
    const non = noCard;
    const cards = hasCard;

    return (
        <FieldGroup>
            <Field className={style.cardDisplay}>
                {cards.length === 0 ? (
                    <div className={style.noCard}>
                        <h2>You don't have card yet.</h2>
                    </div>
                ) : (
                    <FieldGroup>
                        {cards.map((card, index) => (
                            <LoadCard key={index} {...card} />
                        ))}
                    </FieldGroup>
                )}
            </Field>
            <Field orientation={"horizontal"}>
                <Field></Field>
                <AddPaymentMethod />
            </Field>
        </FieldGroup>
    );
};
export default Payment;
