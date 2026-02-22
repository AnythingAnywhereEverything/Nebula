import { SellerHeader, SellerToolbarRow } from "@components/layouts/sellerPageLayout";
import React from "react";
import SellerSettingOption from "./renderSellerSetting";

// IM LAZYYYYYYY
const SellerSettingHeader:React.FC = () =>{
    return(
        <>
        <SellerHeader>
                Shipping Setting
            </SellerHeader>
            
            <SellerToolbarRow>
                <SellerSettingOption/>
            </SellerToolbarRow>
        </>
    )
}

export default SellerSettingHeader;