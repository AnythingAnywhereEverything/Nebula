import { useAuthService } from "@/hooks/useAuthService";
import { useUser } from "@/hooks/useUser";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Field, FieldDescription, FieldLabel, Label } from "@components/ui/NebulaUI";

import s from "@styles/features/profilebadge.module.scss"
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";


export function ProfileBadge() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const router = useRouter();

    const { data, isLoading } = useUser();
    const { logout } = useAuthService();
    

    useEffect(() => 
        {setMounted(true)},
    []);

    const displayName = data?.display_name ?? "Guest";
    const username = data ? "@" + data.username : "@guest";
    
    if (!mounted || !resolvedTheme) return null;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={s.container}>
                    <div className={s.avatar}>
                        <Image 
                            src={(data?.profile_picture_url
                                    ? `/cdn/${data.profile_picture_url}`
                                    : "/default/default_profile.jpg")
                                }
                            alt="Profile"
                            fill
                            priority
                            sizes="400px"
                            />
                    </div>
                    <div>
                        <FieldLabel>{isLoading ? "Loading..." : displayName}</FieldLabel>
                        <FieldDescription>{isLoading ? "..." : username}</FieldDescription>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" style={{width: "calc(var(--spacing) * 48)"}}>
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
                    <DropdownMenuItem asChild>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Notification</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/order"}>My Orders</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/promotion"}>Promotion</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/finance"}>Finance Updates</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={"/user/notification/nebula"}>Nebula Updates</Link>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Theme: {theme && theme.charAt(0).toUpperCase()+theme.slice(1)}</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value="system">Device Theme</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="light">Light Theme</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">Dark Theme</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="midnight">Midnight Theme</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Nebula Shops</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={"/portal/seller/dashboard"}>Dashboard</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={() => logout(router)}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}