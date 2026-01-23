import cp from '@styles/features/optionpanel.module.scss'
import React from "react";
import NebulaProductDisplay from "../../ui/NebulaProductDisplay";


const OptionPanel: React.FC = () => {
    return (
        <div className={cp.optionsContainer}>
            <div className={cp.giftsContainer}>
                <NebulaProductDisplay title="Shop gifts for someone" recommend="gifts" type={"showMore"} max_rows={1}/>
                <NebulaProductDisplay title="Shop gifts by price" recommend="gifts" max_price={50} type={"showMore"} max_rows={1}/>
            </div>
            <NebulaProductDisplay title="Seasonal products" recommend="seasonal" max_rows={1} type={"showMore"}/>
        </div>
    )
}

export default OptionPanel;