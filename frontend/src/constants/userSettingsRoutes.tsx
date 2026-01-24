import ProfilePage from "@components/features/settings/content/accountProfile";

export const userSettingsAllowList: Record<string, {
    component: React.ComponentType;
    title: string;
    description: string;
    extra?: React.ComponentType;
}> = {
    // Account Areas
    "/account/profile": {
        component: ProfilePage,
        title: "Profile",
        description: "Edit your personal info",
    },
    "/account/payment": {
        component: () => <p>Payment Page</p>,
        title: "Banks & Cards",
        description: "Manage your payment methods",
    },
    "/account/address": {
        component: () => <p>Address Page</p>,
        title: "Address",
        description: "Manage your delivery addresses",
    },
    "/account/password": {
        component: () => <p>Change Password</p>,
        title: "Change Password",
        description: "Update your password",
    },
    "/account/privacy": {
        component: () => <p>Privacy Settings</p>,
        title: "Privacy Settings",
        description: "Manage your privacy preferences",
    },
    "/account/notification": {
        component: () => <p>Notification Settings</p>,
        title: "Notifications",
        description: "Manage your notification preferences",
    },

    // My Purchases Area
    "/purchaes": {
        component: () => <p>My Purchases</p>,
        title: "My Purchases",
        description: "View your purchase history",
    },

    // Notifications Areas
    "/notification/order": {
        component: () => <p>Order Updates</p>,
        title: "Order Updates",
        description: "Track your order notifications",
    },
    "/notification/payment": {
        component: () => <p>Promotions</p>,
        title: "Promotions",
        description: "See promotional updates",
    },
    "/notification/finance": {
        component: () => <p>Finance Updates</p>,
        title: "Finance Updates",
        description: "Updates about financial activity",
    },
    "/notification/nebula": {
        component: () => <p>Nebula Updates</p>,
        title: "Nebula Updates",
        description: "System-wide notifications from Nebula",
    },
};
