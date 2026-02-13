import { useRouter } from "next/router";
import { useEffect } from "react";
import { portalSellerAllowedList } from "@/constants/portalSellerRoutes";
import { NextPageWithLayout } from "@/types/global";
import PortalLayout from "@components/layouts/main-layouts/portalLayout";
import { usePathname } from 'next/navigation';

import s from "@styles/sidebar.module.scss"
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, Icon, Separator } from "@components/ui/NebulaUI";
import Link from "next/link";

const SellerPortal: NextPageWithLayout = () => {
    const router = useRouter();
    const { slug } = router.query;

    const currentPath = Array.isArray(slug) ? "/" + slug.join("/") : "/seller/dashboard";

    const pageMeta = portalSellerAllowedList[currentPath];

    useEffect(() => {
        if (!router.isReady) return;

        if (!pageMeta || !pageMeta.component) router.replace("/portal/seller/dashboard");
    }, [router, pageMeta]);

    if (!router.isReady || !pageMeta || !pageMeta.component) return <p>Loading...</p>;

    const PageComponent = pageMeta.component;

    return (
        <div>
            <PageComponent />
        </div>
    );
}

SellerPortal.getLayout = (page) => {
    return <PortalLayout Sidebar={SellerSideBar}>{page}</PortalLayout>
}

const SellerSideBar: React.FC = () => {

    const currentPath = usePathname();

    const renderSidebarButtons = (
        items: { icon: string; name: string; link?: string }[],
        activePath: string
    ) => {
        return items.map((item, index) => {
            const isActive =
                typeof activePath === 'string' &&
                typeof item.link === 'string' &&
                activePath.startsWith(item.link);
    
            return (
                <Button
                    key={index}
                    size={"sm"}
                    variant={"ghost"}
                    justify={"start"}
                    asChild
                    className={isActive ? s.active : ''}
                >
                    <Link href={item.link ?? ""}>
                        <Icon value={item.icon} />
                        {item.name}
                    </Link>
                </Button>
            );
        });
    };

    const ListMapping = [
        {
            description: null,
            items: [
                { icon: "", name: "Shop Dashboard", link: "/portal/seller/dashboard" },
                { icon: "󱝋", name: "Cancel Refund Return", link: "/portal/seller/canceled" },
            ]
        },
        {
            description: "Order",
            items: [
                { icon: "", name: "My Orders", link: "/portal/seller/order/my_order" },
                { icon: "", name: "Mass Shipping", link: "/portal/seller/order/mass_shipping" },
                { icon: "", name: "Shipping Settings", link: "/portal/seller/order/setting" },
            ]
        },
        {
            description: "Product",
            items: [
                { icon: "󰏗", name: "Shop Products", link: "/portal/seller/products/product_list" },
                { icon: "󱧕", name: "Add New Product", link: "/portal/seller/products/new_product" },
            ]
        },
        {
            description: "Finance",
            items: [
                { icon: "", name: "My income", link: "/portal/seller/finance/my_income"},
                { icon: "", name: "My balance", link: "/portal/seller/finance/my_balance"},
                { icon: "", name: "Bank account", link: "/portal/seller/finance/bank_account"},
            ]
        },
        {
        description: "Data",
        items: [
                { icon: "", name: "Bussinate insight", link: "/portal/seller/data/businate_insight"},
                { icon: "󱕎", name: "Account health", link: "/portal/seller/data/account_health"},
            ]
        },
        

    ];

    return (
        <div data-component="sidebar" className={s.sidebar}>
            <Field className={s.sidebarHeader}>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className={s.shopSelector}>
                            <div className={s.imageContainer}>
                                <img src="https://placehold.co/50" width={50} height={50} alt="" />
                            </div>
                            <div className={s.shopInfo}>
                                <p className={s.shopname}>Longggg Shop Name</p>
                                <p className={s.shoplabel}>Shop label</p>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Shop you owned</DropdownMenuLabel>
                            <DropdownMenuItem>NebulaStore</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Icon value="" />
                            Create new shop
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Field>
            <FieldGroup className={s.sidebarContent}>
                {ListMapping.map((section, index) => (
                    <Field key={index}>
                        {section.description && (
                            <FieldDescription>
                                {section.description}
                            </FieldDescription>
                        )}
                        {renderSidebarButtons(section.items, currentPath)}
                    </Field>
                ))}
            </FieldGroup>
            <Separator/>
            <Field className={s.sidebarFooter}>
                Footer
            </Field>
        </div>
    )
}


export default SellerPortal
