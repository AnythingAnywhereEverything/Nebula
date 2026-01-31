import ProfilePage from "@components/features/settings/content/accountProfile";
import Address from "@components/features/settings/content/address";
import Payment from "@components/features/settings/content/payment";
import ChangePassword from "@components/features/settings/content/changePassword";
import Notification from "@components/features/settings/content/notification";
import OrderUpdate from "@components/features/settings/content/orderUpdate";
import PromotionNotification from "@components/features/settings/content/promotionNoti";
import FinanceUpdates from "@components/features/settings/content/financeUpdate";
import WebUpdate from "@components/features/settings/content/nebulaUpdate";

import NewAddressBtn from "@components/features/settings/address/newAddressButton";

export const userSettingsAllowList: Record<string, {
    component: React.ComponentType;
    title: string;
    description: string;
    extra?: React.ReactNode;
}> = {
    // Account Areas
    "/account/profile": {
        component: ProfilePage,
        title: "Profile",
        description: "Edit your personal info",
    },
    "/account/payment": {
        component:  Payment,
        title: "Banks & Cards",
        description: "Manage your payment methods",
    },
    "/account/address": {
        component: Address,
        title: "Address",
        description: "Manage your delivery addresses",
        extra: <NewAddressBtn/>
    },
    "/account/password": {
        component: ChangePassword,
        title: "Change Password",
        description: "Update your password",
    },
    "/account/privacy": {
        component: () => <p>Privacy Settings</p>,
        title: "Privacy Settings",
        description: "Manage your privacy preferences",
    },
    "/account/notification": {
        component: Notification,
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
        component: OrderUpdate,
        title: "Order Updates",
        description: "Track your order notifications",
    },
    "/notification/promotion": {
        component: PromotionNotification,
        title: "Promotions",
        description: "See promotional updates",
    },
    "/notification/finance": {
        component: FinanceUpdates,
        title: "Finance Updates",
        description: "Updates about financial activity",
    },
    "/notification/nebula": {
        component: WebUpdate,
        title: "Nebula Updates",
        description: "System-wide notifications from Nebula",
    },
};
