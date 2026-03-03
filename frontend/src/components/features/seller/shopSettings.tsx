import {
    Field,
    FieldSeparator,
} from "@components/ui/NebulaUI";
import {
    SellerHeader,
    SellerLayout,
    SellerPanel,
    SellerPanelHeader,
} from "@components/layouts/sellerPageLayout";

export default function ShopSettings() {
    return (
        <SellerLayout>
            <SellerHeader>Shop Settings</SellerHeader>
            <SellerPanel>
                <SellerPanelHeader>Shop basic information</SellerPanelHeader>
                <FieldSeparator />
                <Field>
                    
                </Field>
            </SellerPanel>
        </SellerLayout>
    );
}
