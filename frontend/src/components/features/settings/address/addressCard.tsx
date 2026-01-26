import React from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import style from "@styles/layouts/address.module.scss"
import { AddressInfo } from "src/types/address";

const AddressCard: React.FC<AddressInfo> = ({
    name,
    internationalPrefix,
    phoneNumber,
    addressLocal,
    addressInter,
    postalCode
}) => {
    return (
        <div className={style.addressCard}>
            <div className={style.header}>
                
                <div className={style.name}>
                    <h3>{name}</h3> <span>|</span>
                    <h3>({internationalPrefix}) {phoneNumber}</h3>
                </div>
                
                <NebulaButton 
                btnValues = "Edit"
                onClick={()=>{}}
                className={style.edit}
                />
            </div>
            <div className={style.cardInfo}>
                <div style={{opacity: "50%"}}>
                    <div className={style.local}>
                        <p>{addressLocal} {postalCode}</p>
                    </div>
                    
                    <div>
                        <p>{addressInter} {postalCode}</p>
                    </div>
                </div>
                
                <NebulaButton 
                btnValues = "Set as default"
                onClick={() => {}}
                className={style.setDefault}
                />
            </div>
        </div>
    );
}

export default AddressCard;