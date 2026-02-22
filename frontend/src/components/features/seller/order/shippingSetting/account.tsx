import { SellerContent, SellerLayout } from "@components/layouts/sellerPageLayout";
import React from "react";
import SellerSettingHeader from "./sellerHeader";

const SellerSettingAccount: React.FC = () => {
    return(
        <SellerLayout>
            <SellerSettingHeader/>

            <SellerContent>
                <h4>Account</h4>

                
            </SellerContent>
            

        </SellerLayout>
    )
}

export default SellerSettingAccount;