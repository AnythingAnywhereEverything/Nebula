import { SellerContent, SellerHeader, SellerLayout, SellerToolbarRow } from "@components/layouts/sellerPageLayout";
import { Button, Field, FieldDescription, FieldLabel, FieldSeparator, Switch } from "@components/ui/NebulaUI";
import Form from "next/form";
import React, { useState } from "react";
import SellerSettingHeader from "./sellerHeader";

const SellerSettingProduct:React.FC = () => {
    return(
        <SellerLayout>
            <SellerSettingHeader/>
            
            <SellerContent>        
                    <Form action={'#'}>
                        <Field orientation={'horizontal'} style={{padding: "calc(var(--spacing)*3) 0"}}>
                            <Field>
                                <FieldLabel>Allow Nebula or Others to use your Content</FieldLabel>
                                <FieldDescription>In accordance with Nebula's Terms of Service, you agree that Nebula and other parties may use, modify, or adapt any images, videos, or other content you provide in connection with the Services, including for commercial purposes.</FieldDescription>
                            </Field>
                            <Switch
                            />
                        </Field>
                    </Form>
            </SellerContent>
    </SellerLayout>
    )
}

export default SellerSettingProduct;