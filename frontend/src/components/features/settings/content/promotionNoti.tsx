import React from "react";
import s from "@styles/layouts/promotionNotification.module.scss"
import { Button } from "@components/ui/NebulaUI";
import NotificationComponent from "../notification/notificationComponent";
import { usePathname } from "next/navigation";
import { promotionItems } from "src/mocks/notificationComponent.mock";

const PromotionNotification: React.FC = () => {
    const pathname = usePathname()
    
    const hasButton = pathname !== "/notification/order"
    const promotions = promotionItems
    const noPromo = [];
    return(
        <section className={s.promotionContainer}>
            <div className={s.promotionHeader}>
                <Button
                variant={`outline`}
                className={s.markAsRead}
                onClick={() => {}}
                > Mark all as read
                </Button>
            </div>

            {promotions.length === 0 ? (
                <section>
                    <p>No promotion yet</p>
                </section>
            ) : (
                promotions.map((item , index) => (
                    <NotificationComponent
                    key={index}
                    linkToPage={item.linkToPage}
                    title = {item.title}
                    description={item.description}
                    mainImage={item.mainImage}
                    hasButton = {hasButton}
                    timestamp={item.timestamp}
                    />
                ))
            )}
        </section>
    )
}

export default PromotionNotification