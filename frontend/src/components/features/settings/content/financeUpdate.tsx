import React from "react";
import s from "@styles/layouts/notificationSetting.module.scss"
import { financeItems } from "src/mocks/notificationComponent.mock";
import { usePathname } from "next/navigation";
import NotificationComponent from "../notification/notificationComponent";

const FinanceUpdates:React.FC = () => {
    const pathname = usePathname()
    
        const hasButton = pathname !== "/notification/order"
        const finances = financeItems
        const noFinance = []
    return(
        <section className={s.financeContainer}>
            {finances.length === 0 ? (
                <section>
                    <p>You dont have any finances yet</p>
                </section>
            ) : (
                finances.map((item , index) => (
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

export default FinanceUpdates;