import React from "react";
import s from "@styles/layouts/notificationComponent.module.scss"
import { Button, Field, FieldGroup } from "@components/ui/NebulaUI";
import NotificationComponent from "../notification/notificationComponent";
import { usePathname } from "next/navigation";
import { promotionItems } from "src/mocks/notificationComponent.mock";

const PromotionNotification: React.FC = () => {
    const pathname = usePathname()
    
    const hasButton = pathname !== "/notification/order"
    const noPromo = [];
    const promotions = promotionItems
    return(
        <FieldGroup>
            <Field orientation={"horizontal"} className={s.promotionHeader}>
                <Field></Field>
                <Button
                className={s.markAsRead}
                onClick={() => {}}
                > Mark all as read
                </Button>
            </Field>


            <FieldGroup>
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
            </FieldGroup>
        </FieldGroup>
    )
}

export default PromotionNotification