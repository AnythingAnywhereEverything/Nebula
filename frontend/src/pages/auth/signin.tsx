import React, { useState } from "react";
import Link from "next/link";
import style from '@styles/landing.module.scss';

export default function register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return(
            <div className={`${style.registerContainer} ${style.light}`}>
                <div className={style.signInHeader}>
                    <h1>Catalize</h1>
                    <h2>Create an account</h2>
                </div>

                {/* REGISTER FORM */}
                <form action="" className={style.inputFrom}>
                    <div className={style.inputBox}>
                        <p>First name</p>
                        <input  id="firstName" type="text" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className={style.inputBox}>
                        <p>Last name</p>
                        <input  id="lastName" type="text" value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className={style.inputBox}>
                        <p>Email</p>
                        <input id="email" type="text" autoComplete="off" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>


                    <div className={style.inputBox}>
                        <p>Password</p>
                        <input id="password" type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className={style.policyBox}>
                        <div className={style.box}>
                            <input type="checkbox" />
                            <label htmlFor="checkbox">Policy</label>
                        </div>

                        <div className={style.box}>
                            <input type="checkbox" />
                            <label htmlFor="checkbox" style={{opacity: "40%"}}>(Optional) accept advertisement through email</label>
                        </div>

                        <div className={style.policyMessage}>
                            <p>Please read the policy before you agree to Catalize policy</p>
                        </div>
                    </div>
                </form>
                {/* END */}

                {/* ADD ONLICK LATER*/}
                <div className={style.submitButton}>Sign-up</div>
            </div>
    );

}