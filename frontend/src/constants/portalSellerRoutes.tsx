import MyProduct from "@components/features/seller/myProduct/myProduct";

export const portalSellerAllowedList: Record<string, {
    component: React.ComponentType;
}> = {
    "/dashboard": {
        component: () => <p>Dashboard</p>
    },
    "/myProduct": {
        component: MyProduct
    }
}