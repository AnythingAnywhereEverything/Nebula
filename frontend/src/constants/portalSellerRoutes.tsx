export const portalSellerAllowedList: Record<string, {
    component: React.ComponentType;
}> = {
    "/dashboard": {
        component: () => <p>Dashboard</p>
    }
}