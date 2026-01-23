import cp from '@styles/features/optionpanel.module.scss'
import React from "react";
import SelectorSearch from "./NebulaProductField";


const OptionPanel: React.FC = () => {
    return (
        <div className={cp.optionsContainer}>
            <div className={cp.giftsContainer}>
                <SelectorSearch title="Shop gifts for someone" recommend="gifts" type={"showMore"}/>
                <SelectorSearch title="Shop gifts by price" recommend="gifts" max_price={50} type={"showMore"}/>
            </div>
            <SelectorSearch title="Seasonal products" recommend="seasonal" max_rows={1} type={"showMore"}/>
        </div>
    )
}

export default OptionPanel;