import { SellerContent, SellerLayout } from "@components/layouts/sellerPageLayout";
import React, { useState } from "react";
import SellerSettingHeader from "./sellerHeader";
import { Button, Field, FieldDescription, FieldLabel, FieldSeparator, Switch } from "@components/ui/NebulaUI";

const SellerSettingMessage: React.FC =() => {

    const [bitmask, setBitmask] = useState(0)
        
    const toggleOption = (value: number) => {
      setBitmask((prev) => prev ^ value);
    };

    const notificationItem = [
    {
        key: "alert",
        label: "Play a sound for new messages",
        description: "Make sure your device is not muted and enable sound permissions for this site in your browser settings.",
        value: 1 << 1
    },
    {
        key: "notification",
        label: "Show a popup for new messages",
        description: "Enable notification permissions for this site in your browser settings. We recommend using the latest version of Google Chrome.",
        value: 1 << 2
    },
]

    return(
        <SellerLayout>
            <SellerSettingHeader/>

            <SellerContent>
                <h4>Message Receving</h4>
                <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                    <Field>
                        <FieldLabel>Receive Nebula Messages</FieldLabel>
                        <FieldDescription>Enable this toggle to receive from Nebula</FieldDescription>
                    </Field>
                    <Switch
                    value={1 << 0}/>
                </Field>
            </SellerContent>

            <SellerContent>
                <h4>Notification</h4>
                {notificationItem.map((option) =>(
                    <Field key={option.key}>
                        <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                            <Field>
                                <FieldLabel>{option.label}</FieldLabel>
                                <FieldDescription>{option.description}</FieldDescription>
                            </Field>
                            <Switch
                              checked={(bitmask & option.value) !== 0}
                              onCheckedChange={() => toggleOption(option.value)}
                              />
                        </Field>
                        {option.key !='notification' && (
                            <FieldSeparator/>
                        )}
                    </Field>
                ))}
            </SellerContent>

            <SellerContent>
                <h4>Block User</h4>
                <FieldDescription>List of users you have blocked from chat</FieldDescription>
                <table>
                    <thead>
                        <tr>
                            <th style={{width: '40%'}}>User</th>
                            <th style={{width: '10%'}}>Block time</th>
                            <th style={{width: '40%'}}>Action</th>
                        </tr>
                    </thead>
                    
                    <tbody style={{minHeight: '400px'}}></tbody>
                </table>
            </SellerContent>
        </SellerLayout>
    )
}

export default SellerSettingMessage;