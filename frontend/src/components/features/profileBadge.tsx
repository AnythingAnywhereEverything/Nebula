import { useAuthService } from "@/hooks/useAuthService";
import { useShop } from "@/hooks/useShop";
import { useUser } from "@/hooks/useUser";
import Avatar from "@components/ui/Nebula/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    FieldDescription,
    FieldLabel,
    Icon,
} from "@components/ui/NebulaUI";

import s from "@styles/features/profilebadge.module.scss";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function ProfileBadge() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const router = useRouter();

    const { data, isLoading, isError } = useUser();
    const { data: shopData } = useShop();
    const { logout } = useAuthService();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isError) {
            router.push("/auth/signin");
        }
    }, [isError, router]);

    if (!mounted || !resolvedTheme) return null;

    if (isLoading) return null;

    if (!data) return null;

    const displayName = data.display_name;
    const username = "@" + data.username;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={s.container}>
                    <Avatar
                        src={data?.profile_picture_url}
                        fill
                        className={s.avatar}
                    />
                    <div>
                        <FieldLabel>
                            {isLoading ? "Loading..." : displayName}
                        </FieldLabel>
                        <FieldDescription>
                            {isLoading ? "..." : username}
                        </FieldDescription>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                style={{ width: "calc(var(--spacing) * 48)" }}
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={"/user/account/profile"}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"/user/account/payment"}>Cards</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"/user/purchaes"}>My Purchases</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild></DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Notification
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/order"}>
                                        My Orders
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/promotion"}>
                                        Promotion
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/finance"}>
                                        Finance Updates
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/nebula"}>
                                        Nebula Updates
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Theme:{" "}
                            {theme &&
                                theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={theme}
                                    onValueChange={setTheme}
                                >
                                    <DropdownMenuRadioItem value="system">
                                        Device Theme
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="light">
                                        Light Theme
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                        Dark Theme
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="midnight">
                                        Midnight Theme
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            My Nebula Shops
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    Owned shops
                                </DropdownMenuLabel>

                                {shopData?.owned?.length ? (
                                    shopData.owned.map((shop) => (
                                        <DropdownMenuItem
                                            key={`owned-${shop.id}`}
                                            asChild
                                        >
                                            <Link
                                                href={`/portal/seller/${shop.id}/dashboard`}
                                            >
                                                {shop.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem disabled>
                                        No owned shops
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            {/* Associate shops */}
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    Associate shops
                                </DropdownMenuLabel>

                                {shopData?.associate?.length ? (
                                    shopData.associate.map((shop) => (
                                        <DropdownMenuItem
                                            key={`associate-${shop.id}`}
                                            asChild
                                        >
                                            <Link
                                                href={`/portal/seller/${shop.id}/dashboard`}
                                            >
                                                {shop.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem disabled>
                                        No associate shops
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/portal/seller/shop/new">
                                    <Icon value="" />
                                    Create new shop
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => logout(router)}
                    >
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
