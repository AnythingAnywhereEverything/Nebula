import React, { useState } from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import AccountSetting from "@components/features/profiles/account";

// Style
import style from "@styles/layouts/profile.module.scss"
import sProfile from "@styles/features/profile/account.module.scss"

export default function profile() {
    const [active, inactive] = useState(true);

    return (
        <section className={style.profileSection}>
            <div className={style.profileContainer}>
                <section className={style.leftSide}>
        
                    <div className={style.profile}>
                        <div className={style.profilePicture}>
                            <img src="https://placehold.co/400" alt="" />
                        </div>

                        <div className={style.profileName}>
                            <p>Username</p>
                            <p>Edit profile</p>
                        </div>
                    </div>

                    <div className={style.leftComponent}>
                        <ul className={sProfile.profileBtn}>
                            
                            <li>
                                <div 
                                className={sProfile.account}
                                onClick={() => {
                                    
                                }}>
                                    <span>Profile</span>
                                </div>
                            </li>

                        </ul>
                        {/* 
                        Profile
                        Addresses
                        Change Password
                        Privacy
                        Notification
                        */}
                        {/* etc */}
                    </div>

                </section>
        
                <section className={style.rightSide}>
                    {/* Compornent */}
                        <AccountSetting
                        active = {true}
                        />
                </section>
            </div>
        </section>
    )
}