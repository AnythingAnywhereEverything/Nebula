import React, {useState} from "react";
import s from "@styles/layouts/mypurchase.module.scss"
import MyPurchaseFilter from "../mypurchase/purchaseFilter";
import { Combobox } from "@components/ui/NebulaUI";
import PurchaseBox from "../mypurchase/puchaseBox";

const MyPurchase: React.FC = () => {
    const [revealPurchase,setRevealPuchase] = useState(false);

    return (
        <section className={s.puchaseContainer}>
            <MyPurchaseFilter />
                
            <PurchaseBox />
        </section>
    )
}

export default MyPurchase;