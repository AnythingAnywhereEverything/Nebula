import CancelRefunedReturn from "@components/features/seller/cancelProduct";
import myOrder from "@components/features/seller/myOrder";
import MyProduct from "@components/features/seller/myProduct";

export const portalSellerAllowedList: Record<string, {
    component: React.ComponentType;
}> = {
    "/dashboard": {
        component: () => <p>Dashboard</p>
    },
    "/canceled": {
        component: CancelRefunedReturn
    },

    "/order/my_order":{
        component: myOrder 
    },
    "/order/mass_shipping":{
        component: () => <p>mass shipping</p>
    },
    "/order/setting":{
        component: () => <p>shipping setting</p>
    },

    "/products/product_list": {
        component: MyProduct
    },
    "/products/new_product": {
        component: () => <p>Add new product</p>
    },

    "/finance/my_income":{
        component: () => <p>my income</p>
    },
    "/finance/my_balance":{
        component: () => <p>my balance</p>
    },
    "/finance/bank_account":{
        component: () => <p>bank account</p>
    },
    
    "/data/businate_insight":{
        component: () => <p>bank account</p>
    },
    "/data/account_health":{
        component: () => <p>bank account</p>
    },
}