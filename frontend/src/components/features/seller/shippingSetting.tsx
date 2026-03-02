import { SellerContent, SellerHeader, SellerLayout, SellerToolbarRow } from "@components/layouts/sellerPageLayout";
import React, { use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import router from "next/router";

export default function ShippingSetting(){

    return(
        <SellerLayout>
            Hello world.
        </SellerLayout>
    )
} 

{/* <SellerLayout>
            <SellerHeader>
                Shipping Setting
            </SellerHeader>

            <SellerToolbarRow>
                <SellerSettingOption/>
            </SellerToolbarRow>
            
            <SellerContent>
                <Field orientation={'horizontal'}>
                    <Icon>󰏗</Icon>
                    <FieldLabel>Shipping Channel</FieldLabel>
                </Field>

                <SellerContent>
                    <Field style={{padding: "calc(var(--spacing) * 4)"}}>
                        <FieldLabel>Shipping Logistic</FieldLabel>
                        <Field orientation={'horizontal'}>

                        </Field>
                    </Field>
                </SellerContent>

                 {renderSettingContent()}
            </SellerContent>
        </SellerLayout> */}