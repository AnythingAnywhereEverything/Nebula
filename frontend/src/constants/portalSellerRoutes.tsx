import AddNewProduct from "@components/features/seller/addProduct";
import CancelRefunedReturn from "@components/features/seller/cancelProduct";
import ShopDashboard from "@components/features/seller/dashboard";
import EditProduct from "@components/features/seller/editProduct";
import MassShipPage from "@components/features/seller/massShip";
import myOrder from "@components/features/seller/myOrder";
import MyProduct from "@components/features/seller/myProduct";
import SellerSettingAccount from "@components/features/seller/order/shippingSetting/account";
import SellerSettingMessage from "@components/features/seller/order/shippingSetting/chat";
import SellerNotificationSetting from "@components/features/seller/order/shippingSetting/notification";
import SellerSettingPayment from "@components/features/seller/order/shippingSetting/payment";
import SellerSettingProduct from "@components/features/seller/order/shippingSetting/product";
import SellerSettingVacation from "@components/features/seller/order/shippingSetting/vacation";
import RoleComponent from "@components/features/seller/settings/role";
import ShippingSetting from "@components/features/seller/shippingSetting";
import ShopSettings from "@components/features/seller/shopSettings";

export const portalSellerAllowedList: Record<string, {
    component: React.ComponentType;
}> = {
    "/dashboard": {
        component: ShopDashboard
    },
    "/settings": {
        component: ShopSettings
    },
    
    "/settings/role":{
        component: RoleComponent
    },
    
    "/canceled": {
        component: CancelRefunedReturn
    },

    "/order/my_order":{
        component: myOrder 
    },
    "/order/mass_shipping":{
        component: MassShipPage
    },
    "/order/setting":{
        component: ShippingSetting
    },
    

    "/products/product_list": {
        component: MyProduct
    },
    "/products/edit_product": {
        component: EditProduct
    },
    "/products/new_product": {
        component: AddNewProduct
    },

    "/finance/my_income":{
        component: () => <p>my income</p>
    },
    "/finance/my_balance":{
        component: () => <p>my balance</p>
    },


    // Setting
    "/order/setting/account":{
        component: SellerSettingAccount
    },
    
    "/order/setting/notification":{
        component: SellerNotificationSetting
    },

    "/order/setting/product":{
        component: SellerSettingProduct
    },

    "/order/setting/payment":{
        component: SellerSettingPayment
    },

    "/order/setting/chat":{
        component: SellerSettingMessage
    },

    "/order/setting/vacation":{
        component: SellerSettingVacation
    },

}