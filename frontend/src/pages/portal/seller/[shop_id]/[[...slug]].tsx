import { useRouter } from "next/router";
import { useEffect } from "react";
import { portalSellerAllowedList } from "@/constants/portalSellerRoutes";
import { NextPageWithLayout } from "@/types/global";
import PortalLayout from "@components/layouts/main-layouts/portalLayout";
import { usePathname } from 'next/navigation';

import s from "@styles/sidebar.module.scss"
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, Icon, Separator } from "@components/ui/NebulaUI";
import Link from "next/link";
import { useShop } from "@/hooks/useShop";
import Avatar from "@components/ui/Nebula/avatar";

const SellerPortal: NextPageWithLayout = () => {
    const router = useRouter();
    const { shop_id, slug } = router.query;

    const { data, isLoading } = useShop();

    const currentPath =
        Array.isArray(slug) && slug.length
        ? "/" + slug.join("/")
        : "/dashboard";

    const pageMeta = portalSellerAllowedList[currentPath];

    const allShops = [
        ...(data?.owned ?? []),
        ...(data?.associate ?? []),
    ];

    const currentShop = allShops.find(
        (shop) => shop.id.toString() === shop_id
    );

    useEffect(() => {
        if (!router.isReady || isLoading) return;

        if (!allShops.length) {
        router.replace("/portal/seller/shop/new");
        return;
        }

        if (!currentShop) {
        const firstShop = allShops[0];

        router.replace(
            `/portal/seller/${firstShop.id}${currentPath}`
        );
        return;
        }

        if (!pageMeta || !pageMeta.component) {
        router.replace(`/portal/seller/${currentShop.id}/dashboard`);
        }
    }, [
        router.isReady,
        isLoading,
        shop_id,
        currentPath,
        pageMeta,
        data,
    ]);

    if (
        !router.isReady ||
        isLoading ||
        !currentShop ||
        !pageMeta ||
        !pageMeta.component
    ) {
        return <p>Loading...</p>;
    }

    const PageComponent = pageMeta.component;

    return (
        <div>
        <PageComponent />
        </div>
    );
};

SellerPortal.getLayout = (page) => {
    return <PortalLayout Sidebar={SellerSideBar}>{page}</PortalLayout>
}

export const SellerSideBar: React.FC = () => {

    const router = useRouter();
    const { shop_id } = router.query;

    const currentPath = usePathname();

    const renderSidebarButtons = (
        items: { icon: string; name: string; link?: string }[],
        activePath: string
    ) => {
        return items.map((item, index) => {
            const fullLink = `/portal/seller/${shop_id}${item.link ?? ""}`;

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
                    <Link href={fullLink}>
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
                { icon: "", name: "Shop Dashboard", link: "/dashboard" },
                { icon: "", name: "Shop Settings", link: "/settings" },
                { icon: "󱝋", name: "Cancel Refund Return", link: "/canceled" },
            ]
        },
        {
            description: "Order",
            items: [
                { icon: "", name: "My Orders", link: "/order/my_order" },
                { icon: "", name: "Mass Shipping", link: "/order/mass_shipping" },
                { icon: "", name: "Shipping Settings", link: "/order/setting" },
            ]
        },
        {
            description: "Product",
            items: [
                { icon: "󰏗", name: "Shop Products", link: "/products/product_list" },
                { icon: "󱧕", name: "Add New Product", link: "/products/new_product" },
            ]
        },
        {
            description: "Finance",
            items: [
                { icon: "", name: "My income", link: "/finance/my_income"},
                { icon: "", name: "My balance", link: "/finance/my_balance"},
            ]
        },

    ];

    //get shops lists from cache

    const {data} = useShop()

    const currentShop =
        data && [...data.owned, ...data.associate].find(
            (shop) => shop.id.toString() === shop_id
        );

    return (
        <div data-component="sidebar" className={s.sidebar}>
            <Field className={s.sidebarHeader}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} asChild>
                            <div className={s.shopSelector}>
                                <Avatar className={s.imageContainer} src={currentShop?.shop_profile_url} fill />
                                <div className={s.shopInfo}>
                                    {
                                        currentShop ? 
                                        (
                                        <>
                                            <p className={s.shopname}>{currentShop.name}</p>
                                            <p className={s.shoplabel}>{currentShop.description}</p>
                                        </>
                                        )
                                        : 
                                        (
                                        <>                  
                                            <p className={s.shopname}>Longggg Shop Name</p>
                                            <p className={s.shoplabel}>Shop label</p>
                                        </>
                                        )
                                    }
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">

                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Owned shops</DropdownMenuLabel>

                            {data?.owned?.length ? (
                            data.owned.map((shop) => (
                                <DropdownMenuItem key={`owned-${shop.id}`} asChild>
                                <Link href={`/portal/seller/${shop.id}/dashboard`}>
                                    {shop.name}
                                </Link>
                                </DropdownMenuItem>
                            ))
                            ) : (
                            <DropdownMenuItem disabled>No owned shops</DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        {/* Associate shops */}
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Associate shops</DropdownMenuLabel>

                            {data?.associate?.length ? (
                            data.associate.map((shop) => (
                                <DropdownMenuItem key={`associate-${shop.id}`} asChild>
                                <Link href={`/portal/seller/${shop.id}/dashboard`}>
                                    {shop.name}
                                </Link>
                                </DropdownMenuItem>
                            ))
                            ) : (
                            <DropdownMenuItem disabled>No associate shops</DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href="/portal/seller/shop/new">
                                <Icon value="" />
                                Create new shop
                            </Link>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </Field>
            <FieldGroup className={s.sidebarContent}>
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    justify={"start"}
                    asChild
                >
                    <Link href={`/store/${shop_id}`}>
                        <Icon value={""} />
                        View your shop
                    </Link>
                </Button>
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
