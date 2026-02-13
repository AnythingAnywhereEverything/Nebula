import { useState } from "react";
import style from '@styles/layouts/authLayout.module.scss';
import { NextPageWithLayout } from "@/types/global";
import AuthLayout from "@components/layouts/main-layouts/authLayout";
import Head from "next/head";
import Form from "next/form";
import { FieldSet, FieldGroup, Field, FieldLabel, Input, InputGroup, InputGroupAddon, Button, Icon, InputGroupInput, FieldDescription, FieldError, FieldSeparator } from "@components/ui/NebulaUI";
import Link from "next/link";
import GoogleAuthButton from "@components/ui/GoogleLoginBtn";
import { cn } from "@lib/utils";
import { register } from "@/api/auth";
import { useRouter } from "next/router";


const SignIn: NextPageWithLayout = () => {

    const [revealPassword, setRevealPassword] = useState(false);
    const [revealConfirm, setRevealConfirm] = useState(false);

    const router = useRouter();

    type Errors = Partial<{
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    }>;

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Errors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setValues(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof Errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const nextErrors: Errors = {};

        if (!values.username.trim()) {
            nextErrors.username = "Username is required.";
        }

        if (!values.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (!values.password) {
            nextErrors.password = "Password is required.";
        } else if (values.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters.";
        }

        if (values.confirmPassword !== values.password) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        console.log("Submitting", values);

        register(values).then(response => {
            router.push("/auth/signin");
        }).catch(error => {
            console.error("Registration error:", error);
        });
    };

    return(
        <>
            <Head>
                <title>Nebula - Sign in</title>
            </Head>
            <div className={cn(style.authContainer)}>
                <div className={style.form}>
                    <FieldSet>
                        <h2>Sign In</h2>
                        <Field>
                            <GoogleAuthButton/>
                        </Field>
                        <Form action={"#"} onSubmit={handleSubmit}>
                            <FieldGroup>

                                <FieldSeparator>
                                    or
                                </FieldSeparator>

                                <Field data-invalid={!!errors.username}>
                                    <FieldLabel htmlFor="username">Username</FieldLabel>
                                    <Input
                                        aria-invalid={!!errors.username}
                                        required
                                        name="username"
                                        id="username"
                                        placeholder="nebula_user"
                                        value={values.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && <FieldError>{errors.username}</FieldError>}
                                </Field>

                                <Field data-invalid={!!errors.email}>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        aria-invalid={!!errors.email}
                                        required
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="example@gmail.com"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <FieldError>{errors.email}</FieldError>}
                                </Field>

                                <Field data-invalid={!!errors.password}>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <InputGroup aria-invalid={!!errors.password}>
                                        <InputGroupAddon align="inline-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => setRevealPassword(v => !v)}
                                            >
                                                <Icon value={revealPassword ? "" : ""} />
                                            </Button>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            required
                                            type={revealPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            placeholder="• • • • • • • •"
                                        />
                                    </InputGroup>
                                    {errors.password && <FieldError>{errors.password}</FieldError>}
                                </Field>

                                <Field data-invalid={!!errors.confirmPassword}>
                                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                    <InputGroup aria-invalid={!!errors.confirmPassword}>
                                        <InputGroupAddon align="inline-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => setRevealConfirm(v => !v)}
                                            >
                                                <Icon value={revealConfirm ? "" : ""} />
                                            </Button>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            required
                                            type={revealConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="• • • • • • • •"
                                        />
                                    </InputGroup>
                                    {errors.confirmPassword && (
                                        <FieldError>{errors.confirmPassword}</FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <Button type="submit">Sign In</Button>
                                </Field>

                                <FieldDescription>
                                    Already have an account? <Link href={"/auth/signin"}>Sign In.</Link>
                                </FieldDescription>
                            </FieldGroup>
                        </Form>
                    </FieldSet>
                </div>
            </div>
        </>
    );
}

SignIn.getLayout = (page) => (
    <AuthLayout>{page}</AuthLayout>
);

export default SignIn;