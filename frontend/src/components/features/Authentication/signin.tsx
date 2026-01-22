import React, { useState } from "react";
import style from "@styles/layouts/authLayout.module.scss";
import { NebulaTextField } from "@components/ui/NebulaTextField";

const SignInForm: React.FC = () => {
    const [form, setForm] = useState({
        identifier: "",
        password: "",
    });

    const handleChange =
        (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({
                ...prev,
                [key]: e.target.value,
            }));
        };

    return (
        <form className={style.inputForm}>
            <h2 className={style.textHeader}>Sign In</h2>
            <div className={style.inputBox}>
                <label htmlFor="identifier">
                    Username or Email
                </label>
                <NebulaTextField
                    id="identifier"
                    type="text"
                    placeholder="username or example@gmail.com"
                    value={form.identifier}
                    require
                    onChange={handleChange("identifier")}
                    minlength={3}
                />
            </div>

            <div className={style.inputBox}>
                <label htmlFor="password">
                    Password
                </label>
                <NebulaTextField
                    id="password"
                    sensitiveInfo
                    placeholder="••••••••"
                    className={style.passwordBox}
                    require
                    value={form.password}
                    onChange={handleChange("password")}
                />
            </div>

            {/* <div className={style.policyBox}>
                <div className={style.box}>
                    <input id="policy" type="checkbox" required />
                    <label htmlFor="policy">By checking this checkbox, you agree to Nebula's Privacy and Policy</label>
                </div>

                <div className={style.box}>
                    <input id="ads" type="checkbox" />
                    <label htmlFor="ads" style={{ opacity: "40%" }}>
                        (Optional) accept advertisement through email
                    </label>
                </div>
            </div> */}
            
            <div className={style.submitContainer}>
                <button type="submit" className={style.submitButton}>Sign In</button>
                <a href="">Forgot password?</a>
            </div>

            <p className={style.notice}>Don't have an account yet? <a href="/auth/signup">Sign up</a>.</p>
        </form>
    );
};

export default SignInForm;
