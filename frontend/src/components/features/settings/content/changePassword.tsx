import React from "react";
import style from "@styles/layouts/changePassword.module.scss"
import { NebulaButton } from "@components/ui/NebulaBtn";
import Link from "next/link";

// Verify first
const ChangePassword: React.FC = () =>{
    return (
        <section className={style.changePasswordContainer}>
            <form action="">

                <div className={style.passwordInput}>
                    <h3>Current Password</h3>
                    <div className={style.forgetPassword}>
                        <Link href={`#`}>forget password?</Link>
                    </div>
                    <div>
                        <input type="password" placeholder="Current password"/>
                    </div>
                </div>

                <div className={style.passwordInput}>
                    <h3>New Password</h3>
                    <input type="password" placeholder="Current password"/>
                </div>

                <div className={style.passwordInput}>
                    <h3>Confirm Password</h3>
                    <input type="password" placeholder="Current password"/>
                </div>

                <div className={style.passwordBtn}>
                    <NebulaButton 
                    btnValues ="Reset"
                    className={style.resetBtn}
                    onClick={()=>{}}
                    />
                    <NebulaButton 
                    btnValues = "Change Password"
                    className={style.changePasswordBtn}
                    onClick={()=>{}}
                    />
                </div>
            </form>
        </section>
    );
}

export default ChangePassword;