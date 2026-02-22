import { SellerContent, SellerLayout } from "@components/layouts/sellerPageLayout";
import React from "react";
import SellerSettingHeader from "./sellerHeader";
import { Field, FieldDescription, FieldLabel, Switch } from "@components/ui/NebulaUI";
import Form from "next/form";

const SellerSettingVacation:React.FC = () => {
    return(
        <SellerLayout>
            <SellerSettingHeader />

            <SellerContent>
                <Form action='#'>
                    <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                        <Field>
                            <FieldLabel>Vacation Mode</FieldLabel>
                            <FieldDescription>Turn on Vacation Mode to prevent buyers from placing new orders. Existing orders must still be fulfiled. It may take up to 1 hour to take effect.</FieldDescription>
                        </Field>
                        <Switch value={1 << 0}/>
                    </Field>
                </Form>
            </SellerContent>
        </SellerLayout>
    )
}

export default SellerSettingVacation;