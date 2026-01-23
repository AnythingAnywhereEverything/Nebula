import React from "react";
import style from "@styles/features/profile/account.module.scss"

interface account {
    active : boolean
};

const AccountSetting: React.FC<account> = (isActive) => {
    
    if (!isActive){
        return;
    }

    return(
        <div className={style.myAccount}>
            <h2>Testing</h2>
        </div>
    );
}

export default AccountSetting;