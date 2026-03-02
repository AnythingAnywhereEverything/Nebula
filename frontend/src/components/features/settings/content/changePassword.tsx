import React, { ChangeEvent, use, useState } from "react";
import Link from "next/link";
import { Button, ButtonGroup, Field, FieldDescription, FieldError, FieldGroup , FieldLabel, FieldSet, Icon, Input, InputGroup, InputGroupAddon, InputGroupInput } from "@components/ui/NebulaUI";
import Form from "next/form";
import { error } from "console";
import { updatePassword } from "@/api/user";

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
        current_password: "",
        new_password: "",
        confirm_password: "",
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

    const strongPasswordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$');
    const validateNewPassword = () =>{
        const nextErrors: Errors = {};

        if (!values.new_password) {
            nextErrors.newPassword = "Password is required.";
        } else if (!strongPasswordRegex.test(values.new_password)){
            nextErrors.newPassword = `minimum length 8 characters.
At least one uppercase letter (A-Z).
At least one lowercase letter (a-z).
At least one digit (0-9).
At least one special character (e.g., !@#$%()-)`
        }
        if (values.confirm_password !== values.new_password) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateNewPassword()) return;

        console.log("Values", values);
        updatePassword(values)
    }
        
    return (
        <section>
            <Form action="#">
                <FieldSet
                style={{width: "50%", margin: "4px"}}
                >
                    <FieldGroup>

                        <Field>
                            <FieldLabel htmlFor="current_password">Current Password</FieldLabel>
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
                                        name="current_password"
                                        id="current-password"
                                        value={values.current_password}
                                        onChange={handleChange}
                                        placeholder="Current password"
                                    />

                                </InputGroup>
                            <FieldDescription>
                                Forgot Password? <Link href={`#`}>Reset password.</Link>
                            </FieldDescription>

                        </Field>

                        <Field data-invalid={!!errors.newPassword}>
                            <FieldLabel htmlFor="new_password">New Password</FieldLabel>
                            <InputGroup aria-invalid={!!errors.newPassword}>
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
                                    name="new_password"
                                    id="new-password"
                                    value={values.new_password}
                                    onChange={handleChange}
                                    placeholder="New password"
                                />
                            </InputGroup>
                            {errors.newPassword && <FieldError style={{whiteSpace: "pre-wrap"}}>{errors.newPassword}</FieldError>}
                        </Field>

                        <Field data-invalid={!!errors.confirmPassword}>
                            <FieldLabel htmlFor="confirm_password">Confirm New Password</FieldLabel>
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
                                    name="confirm_password"
                                    id="confirm-password"
                                    value={values.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />
                            </InputGroup>
                            {errors.confirmPassword && <FieldError >{errors.confirmPassword}</FieldError>}
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
                                    onClick = {handleSubmit}
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