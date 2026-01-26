import { NebulaButton } from "@components/ui/NebulaBtn";
import React from "react";
import style from "@styles/layouts/payment.module.scss"
import { CardInfo } from "src/types/card";

const LoadCard: React.FC<CardInfo> = ({
    cardType,
    cardNumber,
    expireDate
}) => {
    
    const year = expireDate.getFullYear();
    const month = String(expireDate.getMonth() + 1).padStart(2, "0");

    return(
            <div className={style.cardContainer}>
                <div>
                    <img src="https://placehold.co/65x35" alt="" />
                </div>

                <div>{cardType}</div>

                <div>
                    <p>{cardNumber}</p>
                    <p>expire on {year}-{month}</p>
                </div>

                <NebulaButton 
                    btnValues = "Edit"
                    className={style.editBtn}
                    onClick={() => {}}
                />
            </div>
    );
}

export default LoadCard;