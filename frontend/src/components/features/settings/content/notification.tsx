import React from "react";
import { Switch } from "@components/ui/Nebula/switch";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator } from "@components/ui/NebulaUI";

const Notification: React.FC = () => {
    return(
        <FieldGroup>
            <h2 style={{fontWeight: 400}}>Overview</h2>
            <FieldGroup>
                <Field orientation={"horizontal"}>
                    <Field>
                        <FieldLabel htmlFor="in-app">Enable In-app Notification</FieldLabel>
                        <FieldDescription>
                            This will disable notification within the app, allowing you to navigate and shopping in peace.
                        </FieldDescription>
                    </Field>
                    <Switch id="in-app" size="lg" />
                </Field>
                <Field>
                    <FieldLegend>Notify me when...</FieldLegend>
                    <FieldGroup>
                        <Field orientation={"horizontal"}>
                            <Field>
                                <FieldLabel htmlFor="wishlist-noti">My wishlisted product is restocked, low on stock, or out of stock</FieldLabel>
                            </Field>
                            <Switch id="wishlist-noti" size="lg"/>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <Field>
                                <FieldLabel htmlFor="comment-reply">Someone replied on my comment</FieldLabel>
                            </Field>
                            <Switch id="comment-reply" size="lg"/>
                        </Field>
                    </FieldGroup>
                </Field>
            </FieldGroup>
            <FieldSeparator />
            <h2 style={{fontWeight: 400}}>Email</h2>
            <FieldGroup>
                <Field orientation={"horizontal"}>
                    <Field>
                        <FieldLabel htmlFor="announce">Announcement and Updates Emails</FieldLabel>
                        <FieldDescription>Receive email about product updates on upcoming deals and our newest features.</FieldDescription>
                    </Field>
                    <Switch id="announce" size='lg'/>
                </Field>
                <Field orientation={"horizontal"}>
                    <Field>
                        <FieldLabel htmlFor="shipping">Shipping Emails</FieldLabel>
                        <FieldDescription>Updates on shipping and delivery status of all orders.</FieldDescription>
                    </Field>
                    <Switch id="shipping" size='lg'/>
                </Field>
                <Field orientation={"horizontal"}>
                    <Field>
                        <FieldLabel htmlFor="servey">Survey Emails</FieldLabel>
                        <FieldDescription>Receive a servey helping Nebula to be a better places.</FieldDescription>
                    </Field>
                    <Switch id="servey" size='lg'/>
                </Field>
                <Field orientation={"horizontal"}>
                    <Field>
                        <FieldLabel htmlFor="chat">Chat Emails</FieldLabel>
                        <FieldDescription>Notify you once customer/seller reply or starting the message.</FieldDescription>
                    </Field>
                    <Switch id="chat" size='lg'/>
                </Field>
            </FieldGroup>
        </FieldGroup>
    )
}

export default Notification