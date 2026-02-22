import { SellerContent, SellerLayout } from "@components/layouts/sellerPageLayout";
import React from "react";
import SellerSettingHeader from "./sellerHeader";
import { Button, Dialog, DialogContent, DialogTrigger, Field, FieldDescription, FieldLabel, FieldSeparator, Switch } from "@components/ui/NebulaUI";

const SellerSettingPayment:React.FC = () => {
    return(
        <SellerLayout>
            <SellerSettingHeader/>

            <SellerContent>
                <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                    <Field>
                        <FieldLabel>Credit Card</FieldLabel>
                        <FieldDescription>Turn on the toggle to buyer checkout your products by Credit Card Installment (Click here to see transaction fee rules)</FieldDescription>
                    </Field>
                    <Switch/>
                </Field>
                <FieldSeparator/>

                <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                    <Field>
                        <FieldLabel>Seller Balance Pin</FieldLabel>
                        <FieldDescription>Turn on the toggle to buyer checkout your products by Credit Card Installment (Click here to see transaction fee rules)</FieldDescription>
                    </Field>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Create</Button>
                        </DialogTrigger>

                        <DialogContent>
                            
                        </DialogContent>
                    </Dialog>
                </Field>
            </SellerContent>
        </SellerLayout>
    )
}

export default SellerSettingPayment;