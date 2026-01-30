import React from "react";
import style from "@styles/layouts/promotionNotification.module.scss"
import { Button, ButtonGroup } from "@components/ui/NebulaUI";
import Link from "next/link";

const PromotionNotification: React.FC = () => {
    return(
        <section className={style.promotionContainer}>
            <div className={style.promotionHeader}>
                <Button
                variant={`ghost`}
                className={style.markAsRead}
                onClick={() => {}}
                > Mark all as read
                </Button>
            </div>

            <section className={style.promotion}>
                <div className={style.imgContainer}>
                    <img src="https://placehold.co/400" alt="" />
                </div>

                <div className={style.promotionContent}>
                    <h4>Discount 5$</h4>
                    <div className={style.content}>
                        testtttttttttttttttttttttttttttttttasdadadasdttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
                    </div>
                </div>

                <div className={style.viewBtn}>
                    <Button variant={'outline'}><Link href = "#">View more</Link></Button>
                </div>
            </section>
        </section>
    )
}

export default PromotionNotification