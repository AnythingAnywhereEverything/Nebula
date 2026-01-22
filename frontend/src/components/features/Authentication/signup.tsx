import React, { useState } from "react";
import style from "@styles/layouts/authLayout.module.scss";
import { NebulaTextField } from "@components/ui/NebulaTextField";

const SignUpForm: React.FC = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptPolicy: false,
        acceptAds: false,
    });

    const handleChange =
        (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value =
                e.target.type === "checkbox"
                    ? e.target.checked
                    : e.target.value;

            setForm((prev) => ({
                ...prev,
                [key]: value,
            }));
        };

    return (
        <form className={style.inputForm}>
            <h3 className={style.textHeader}>
                Sign Up
            </h3>
            <div className={style.inputBox}>
                <label htmlFor="username">Username</label>
                <NebulaTextField
                    id="username"
                    placeholder="nebula_user"
                    value={form.username}
                    onChange={handleChange("username")}
                    minlength={3}
                />
            </div>

            <div className={style.inputBox}>
                <label htmlFor="email">Email</label>
                <NebulaTextField
                    id="email"
                    type="email"
                    placeholder="you@nebula.dev"
                    value={form.email}
                    onChange={handleChange("email")}
                />
            </div>

            {/* Password */}
            <div className={style.inputBox}>
                <label htmlFor="password">Password</label>
                <NebulaTextField
                    id="password"
                    sensitiveInfo
                    className={style.passwordBox}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange("password")}
                    minlength={8}
                />
            </div>

            {/* Confirm Password */}
            <div className={style.inputBox}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <NebulaTextField
                    id="confirmPassword"
                    sensitiveInfo
                    className={style.passwordBox}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                />
            </div>

            {/* Policies */}
            <div className={style.policyBox}>
                <div className={style.box}>
                    <input
                        id="policy"
                        type="checkbox"
                        checked={form.acceptPolicy}
                        onChange={handleChange("acceptPolicy")}
                        required
                    />
                    <label htmlFor="policy">
                        I agree to the Nebula policy
                    </label>
                </div>

                <div className={style.box}>
                    <input
                        id="ads"
                        type="checkbox"
                        checked={form.acceptAds}
                        onChange={handleChange("acceptAds")}
                    />
                    <label htmlFor="ads" style={{ opacity: "40%" }}>
                        (Optional) Receive updates and offers via email
                    </label>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={!form.acceptPolicy}
                className={style.submitButton}
            >
                Create Account
            </button>

            <p className={style.notice}>Already have an account? <a href="/auth/signin">Sign in</a>.</p>
        </form>
    );
};

export default SignUpForm;
