import { NerdFonts } from "@components/utilities/NerdFonts";
import React from "react";
import style from "@styles/layouts/browsingHistory.module.scss";
import HistoryContainer from "@components/layouts/historyContainer";
import BottomProductContent from "@components/layouts/bottomProductContent";

export default function BrowsingHistory() {
    return(
        <section className={style.historySection}>
            <h2 className={style.historyHeader}>
                <NerdFonts>Your Browsing History</NerdFonts>
            </h2>

            <div>
                <HistoryContainer/>
            </div>

            <BottomProductContent/>
        </section>
    )
}