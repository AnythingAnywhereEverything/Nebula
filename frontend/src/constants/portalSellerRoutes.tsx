import CancelRefunedReturn from "@components/features/seller/cancelProduct";
import MyProduct from "@components/features/seller/myProduct";

export const portalSellerAllowedList: Record<string, {
    component: React.ComponentType;
}> = {
    "/dashboard": {
        component: () => <p>Dashboard</p>
    },
    "/products": {
        component: MyProduct
    },
    "/canceled": {
        component: CancelRefunedReturn
    }
}