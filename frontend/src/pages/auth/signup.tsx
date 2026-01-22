import React from "react";
import style from '@styles/layouts/authLayout.module.scss';
import { NextPageWithLayout } from "src/types/global";
import AuthLayout from "@components/layouts/main-layouts/authLayout";
import SignUpForm from "@components/features/Authentication/signup";
import Head from "next/head";

const SignIn: NextPageWithLayout = () => {

    return(
        <>
            <Head>
                <title>Nebula - Sign in</title>
            </Head>
            <div className={style.authContainer}>
                <SignUpForm/>
            </div>
        </>
    );
}

SignIn.getLayout = (page) => (
    <AuthLayout>{page}</AuthLayout>
);

export default SignIn;