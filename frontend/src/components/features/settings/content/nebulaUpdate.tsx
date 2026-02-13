import React from "react";

import s from "@styles/layouts/notificationSetting.module.scss"
import { NebulaUpdateItems } from "@/mocks/notificationComponent.mock";
import { usePathname } from "next/navigation";
import NotificationComponent from "../notification/notificationComponent";

const WebUpdate: React.FC = () => {
    const pathname = usePathname()
    
    const hasButton = pathname !== "/notification/order"
    const updates = NebulaUpdateItems
    const nothing = []
    return(
        <section className={s.nebulaUpdateContainer}>
            {updates.length === 0 ? (
                <section>
                    <p>We dont have any Updates yet</p>
                </section>
            ) : (
                updates.map((item , index) => (
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

export default WebUpdate