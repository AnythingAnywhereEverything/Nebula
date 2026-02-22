import { SellerContent, SellerHeader, SellerLayout, SellerToolbarRow } from "@components/layouts/sellerPageLayout";
import { Button, ButtonGroup, Field, FieldDescription, FieldLabel, FieldSeparator, Separator, Switch } from "@components/ui/NebulaUI";
import Form from "next/form";
import React, { useState } from "react";
import SellerSettingOption from "./renderSellerSetting";
import SellerSettingHeader from "./sellerHeader";

const SellerNotificationSetting:React.FC = () => {

    const [notificationMask, setNotificationMask] = useState(0)
    
    const toggleOption = (value: number) => {
      setNotificationMask((prev) => prev ^ value);
    };

    const updatesItem = [
        {key: "order", label: "Order",
        description: "Updates on shopping and delivery status of all orders", value: 1 << 0},
        {key: "listing", label: "Listing",
        description : "Latest updates on your product listings' status", value : 1 << 1 },
        {key: "policy", label: "Policy",
        description: "Stay informed about changes to our guidelines, rules and initiatives", value : 1 << 2},    
    ]

    const promotionItem = [
        {key: "promotion", label: "Promotions",
         description: "Exclusive updates on upcoming deals and campaigns", value: 1 << 3},
         {key: "survery", label: "Customer Surveys",
        description: "Receive survey to help Nebula serve you better", value: 1 << 4 },
    ]

    // useEffect(() => {
    //   async function loadSettings() {
    //     const res = await fetch("");
    //     const data = await res.json();
    //     setNotificationMask(data.notificationMask);
    //   }
    
    //   loadSettings();
    // }, []);

    return(
        <SellerLayout>
            <SellerSettingHeader/>
            
            <SellerContent>
            <Field>
                <Field orientation={'horizontal'}>
                    <Field>
                        Email Notification
                    </Field>
                    <Button>
                        Disable Email
                    </Button>
                </Field>
        
                <Field>

                    <Form action={'#'}>
                        <h4  style={{padding: "calc(var(--spacing)*3) 0"}}>Updates</h4>
                        {updatesItem.map((option) => (
                            <Field key={option.key}>
                                <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                                    <Field>
                                        <FieldLabel>{option.label}</FieldLabel>
                                        <FieldDescription>{option.description}</FieldDescription>
                                    </Field>
                                    <Switch
                                      checked={(notificationMask & option.value) !== 0}
                                      onCheckedChange={() => toggleOption(option.value)}
                                    />
                                </Field>
                                <FieldSeparator/>
                            </Field> 
                        ))}
                        
                        <h4  style={{padding: "calc(var(--spacing)*3) 0", marginTop: "calc(var(--spacing)*2)"}}>Promotions and engagement</h4>
                        {promotionItem.map((option) => (
                            <Field key={option.key}>
                                <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                                    <Field>
                                        <FieldLabel>{option.label}</FieldLabel>
                                        <FieldDescription>{option.description}</FieldDescription>
                                    </Field>
                                    <Switch
                                      checked={(notificationMask & option.value) !== 0}
                                      onCheckedChange={() => toggleOption(option.value)}
                                    />
                                </Field>
                                <FieldSeparator/>

                            </Field>
                        ))}
                    </Form>
                </Field>
                <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*2}"}}>
                    <Field></Field>
                    <Button type="reset" variant={'outline'}>Reset</Button>
                    <Button type="submit">Apply</Button>
                </Field>
            </Field>
            </SellerContent>
    </SellerLayout>
    )
}

export default SellerNotificationSetting;

