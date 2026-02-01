import React from "react";
import s from "@styles/layouts/privacy.module.scss"
import Link from "next/link";
import { Button, ButtonGroup, Field, FieldDescription, FieldGroup, FieldLabel, Switch } from "@components/ui/NebulaUI";

const PrivacySetting: React.FC = () => {
    return(
        <section className={s.privacyContainer}>
            <Field orientation={'horizontal'}>
                
                <FieldGroup className={s.privacyItem}>
                    <Field orientation={'horizontal'}>
                        <Field>
                            <FieldLabel className={s.header}>
                                Use data to improve Nebula
                            </FieldLabel>
                        
                        <FieldDescription>
                            Allows us to use and process your information to understand and improve our services.
                            <br />
                            <Link href={'#'}>Learn more</Link>
                        </FieldDescription>

                        
                    </Field>
                        <Switch size="lg" />
                    </Field>
                </FieldGroup>

            </Field>

            <Field>
                <FieldGroup>
                
                    <Field orientation={'horizontal'}>
                        <Field>
                            <h3>Request Account Deletion</h3>
                        </Field>

                        <Field>
                            <ButtonGroup className={s.deleteBtn}>
                                <Button variant={'destructive'}>
                                    Delete
                                </Button>
                            </ButtonGroup>
                        </Field>
                    </Field>    
                
                </FieldGroup>    
            </Field>
        </section>
    )
}

export default PrivacySetting;