import React from "react";
import style from "@styles/layouts/notificationSetting.module.scss"
import { usePathname } from "next/navigation";
import NotificationComponent from "../notification/notificationComponent";
import { orderUpdatesItems } from "src/mocks/notificationComponent.mock";

const OrderUpdate: React.FC = () => {
    const pathname = usePathname()

    const hasButton = pathname === "/notification/order"
    const orders = orderUpdatesItems
    const noOrers = []
    return(
        <section className={style.orderContainer}>

            {orders.length === 0 ? (
                <section>
                    <p>Youdont have any updates yet</p>
                </section>
            ) : (
                orders.map((item , index) => (
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
    );
}

export default OrderUpdate;