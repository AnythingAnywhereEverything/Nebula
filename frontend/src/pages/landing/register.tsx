import React, { useState } from "react";
import Link from "next/link";
import style from '../../styles/landing.module.scss';
import { log } from "console";

export default function register() {

    const [username, setName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 150;

    const years = [];
    for (let i = currentYear; i >= oldestYear; i--){
       years.push(i);
    }

    const monthNames: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = Array.from ({length: 31}, (_,i) => i+1);

    return(
            <div className={style.registerContainer}>
                <div className={style.signInHeader}>
                    <h1>Catalize</h1>
                    <h2>Create an account</h2>
                </div>

                {/* REGISTER FORM */}
                <form action="" className={style.inputFrom}>
                    <div className={style.inputBox}>
                        <p>Email</p>
                        <input id="email" type="text" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={style.inputBox}>
                        <p>Username</p>
                        <input  id="username" type="text" value={username}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={style.inputBox}>
                        <p>Display name</p>
                        <input  id="username" type="text" value={displayName}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={style.inputBox}>
                        <p>Password</p>
                        <input id="password" type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    

                    <div style={{ display: "flex"}} className={style.dateBox}>

                        <select name="Day" id="date-day">
                            <option value="">day</option>
                            
                            {days.map((day) => (
                                <option key={day} value={day}>{day}
                                </option>
                            ))}
                        </select>

                        <select name="Month" id="date-month">
                            <option value="">Month</option>

                            {monthNames.map((month : string, index : number) => (
                                    <option key={index} value={month}>{month}</option>
                            ))}
                        </select>

                        <select name="Year" id="date-years">
                            <option value="">Year</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))};
                        </select>
                    </div>

                    <input type="checkbox" />Policy
                </form>
                {/* END */}

                <button type="button">Sign in </button>
            </div>
    );

}