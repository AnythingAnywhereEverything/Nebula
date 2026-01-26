import React from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import style from "@styles/layouts/payment.module.scss"
import LoadCard from "../payment/hasCard";
import { noCard, hasCard } from "src/mocks/card.mock";

const Payment: React.FC = () => {
    const non = noCard;
    const cards = hasCard;


    return(
        <section className={style.paymentContainer}>
            <div className={style.paymentHead}>
                <h3>Credit / Debit Card</h3>
                <p>These cards will be displayed when you purchase by using Credit/Debit Card or Credit Card Installment.</p>
            </div>

            <section className={style.cardDisplay}>
                {cards.length === 0 ? (
                    <div className={style.noCard}>
                        <h2>You don't have card yet.</h2>
                    </div>
                ) : (
                    <section className={style.hasCard}>
                        {cards.map((card, index) => (
                            <>
                            <LoadCard
                                key={index}
                                cardType={card.cardType}
                                cardNumber={card.cardNumber}
                                expireDate={card.expireDate}
                                />
                            </>
                        ))}
                    </section>
                )}
            </section>

            <NebulaButton
            btnValues = "Add Payments medthod"
            className={style.addCard}
            onClick={() => {

            }}
            />
        </section>
    )
}
export default Payment