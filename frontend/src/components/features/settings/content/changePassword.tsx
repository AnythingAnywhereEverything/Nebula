import React, { useState } from "react";
import style from "@styles/layouts/changePassword.module.scss"
import { NebulaButton } from "@components/ui/NebulaBtn";
import Link from "next/link";
import { Button, ButtonGroup, Field, FieldDescription, FieldGroup , FieldLabel, FieldSet, Icon, Input, InputGroup, InputGroupAddon, InputGroupInput } from "@components/ui/NebulaUI";
import Form from "next/form";

// Verify first
const ChangePassword: React.FC = () =>{
    const [revealPassword, setRevealPassword] = useState(false);
    const [revealNewPassword, setRevealNewPassword] = useState(false);
    const [revealConfirm, setRevealConfirm] = useState(false);
    
    type Errors = Partial<{
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }>;
    
    const [values, setValues] = useState({
        currentPassword: "",
        newPassword: "",
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

    const validate = () =>{
        const nextErrors: Errors = {};
        
        // TODO: regEx and validate the password

    }
        
    return (
        <section className={style.changePasswordContainer}>
            <Form action="#">
                <FieldSet
                style={{width: "50%", margin: "4px"}}
                >
                    <FieldGroup>

                        <Field>
                            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                                <InputGroup>
                                
                                    <InputGroupAddon align="inline-end"
                                    >
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
                                        name="currentPassword"
                                        id="current-password"
                                        value={values.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Current password"
                                    />

                                </InputGroup>
                            <FieldDescription>
                                Forgot Password? <Link href={`#`}>Reset password.</Link>
                            </FieldDescription>

                        </Field>

                        <Field>
                            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                            <InputGroup>
                                
                                <InputGroupAddon align="inline-end">
                                    <Button
                                    type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => setRevealNewPassword(v => !v)}
                                    >
                                        <Icon value={revealNewPassword ? "" : ""} />
                                    </Button>
                                </InputGroupAddon>    
                                    
                                <InputGroupInput
                                    required
                                    type={revealNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    id="new-password"
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    placeholder="New password"
                                />

                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                            <InputGroup>
                                
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
                                    id="confirm-password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />

                            </InputGroup>
                        </Field>

                            <ButtonGroup>
                                
                                <ButtonGroup>
                                    <Button
                                    variant={`outline`}
                                    onClick = {() => {console.log("Hello world");
                                    }}
                                    >
                                        Reset
                                    </Button>

                                </ButtonGroup>

                                <ButtonGroup>
                                    <Button
                                    variant={`default`}
                                    onClick = {() => {console.log("Hello world");
                                    }}
                                    >
                                        Change Password
                                    </Button>
                                </ButtonGroup>

                            </ButtonGroup>
                    </FieldGroup>
                </FieldSet>

            </Form>
        </section>
    );
}

export default ChangePassword;