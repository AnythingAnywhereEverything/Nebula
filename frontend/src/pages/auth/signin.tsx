import { useState } from "react";
import style from '@styles/layouts/authLayout.module.scss';
import { NextPageWithLayout } from "src/types/global";
import AuthLayout from "@components/layouts/main-layouts/authLayout";
import Head from "next/head";
import { Field, FieldLabel, FieldDescription, FieldGroup, FieldLegend, FieldSet, FieldTitle, Input, InputGroup, InputGroupAddon, Button, InputGroupInput, Icon } from "@components/ui/NebulaUI";
import Link from "next/link";
import Form from "next/form";

const SignIn: NextPageWithLayout = () => {

    const [reveal, setReveal] = useState(false);

    return(
        <>
            <Head>
                <title>Nebula - Sign in</title>
            </Head>
            <div className={style.authContainer}>
                <Form action={"#"} className={style.form}>
                    <FieldSet>
                        <h2>Sign In</h2>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username">Username or Email</FieldLabel>
                                <Input required name="username" id="username" placeholder="example@gmail.com" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon align="inline-end">
                                        <Button type="button" variant={"ghost"} size={"icon-xs"} onClick={() => setReveal(!reveal)}>
                                            <Icon value={reveal ? "" : ""}/>
                                        </Button>
                                    </InputGroupAddon>
                                    <InputGroupInput required type={reveal ? "password" : "text"} name="password" id="password" placeholder="• • • • • • • •" />
                                </InputGroup>
                            </Field>
                        </FieldGroup>
                        <Field>
                            <Button type="submit">Sign In</Button>
                            <FieldDescription>
                                <Link href={"#"}>Forgot password?</Link>
                            </FieldDescription>
                        </Field>

                        <FieldDescription>
                            Dont have an account yet? <Link href={"/auth/signup"}>Sign Up.</Link>
                        </FieldDescription>
                    </FieldSet>
                </Form>
            </div>

        </>
    );
}

SignIn.getLayout = (page) => (
    <AuthLayout>{page}</AuthLayout>
);

export default SignIn;