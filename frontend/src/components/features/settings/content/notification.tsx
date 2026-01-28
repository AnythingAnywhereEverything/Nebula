import React from "react";
import style from "@styles/layouts/notification.module.scss"

const Notification: React.FC = () => {
    return(
        <section className={style.notiContainer}>
            <div>Email Notification
                Promotion
                Order Update
                Customer Survey
            </div>
            <div>

                <div>Message Notification</div>
                <div>
                    Promotion
                    Seller Message
                </div>

            </div>
        </section>
    )
}

export default Notification