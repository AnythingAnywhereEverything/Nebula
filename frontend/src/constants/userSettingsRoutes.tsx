import ProfilePage from "@components/features/settings/content/accountProfile";
import Address from "@components/features/settings/content/address";
import Payment from "@components/features/settings/content/payment";
import ChangePassword from "@components/features/settings/content/changePassword";
import Notification from "@components/features/settings/content/notification";
import OrderUpdate from "@components/features/settings/content/orderUpdate";
import PromotionNotification from "@components/features/settings/content/promotionNoti";
import FinanceUpdates from "@components/features/settings/content/financeUpdate";
import WebUpdate from "@components/features/settings/content/nebulaUpdate";

import PrivacySetting from "@components/features/settings/content/privacy";
import MyPurchase from "@components/features/settings/content/myPurchase";
import UserSession from "@components/features/settings/session/userSession";
import AddressButton from "@components/features/settings/address/newAddressButton";

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
        title: "Payment Method",
        description: "Your payment methods are encrypted and stored with a secured payment processing service.",
    },
    "/account/address": {
        component: Address,
        title: "Address",
        description: "Manage your delivery addresses",
        extra: <AddressButton type="new" />
    },
    "/account/password": {
        component: ChangePassword,
        title: "Change Password",
        description: "Update your password",
    },
    "/account/privacy": {
        component: PrivacySetting,
        title: "Privacy Settings",
        description: "Manage your privacy preferences",
    },
    "/account/notification": {
        component: Notification,
        title: "Notifications",
        description: "Manage your notification preferences",
    },
    "/account/session": {
        component: UserSession,
        title: "Session",
        description: "Manage your session",
    },

    // My Purchases Area
    "/purchaes": {
        component: MyPurchase,
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
