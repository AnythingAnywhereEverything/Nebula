import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Field, FieldDescription, FieldLabel, Label } from "@components/ui/NebulaUI";

import s from "@styles/features/profilebadge.module.scss"
import Link from "next/link";

export function ProfileBadge() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={s.container}>
                    <div className={s.avatar}>
                        <img src="https://placehold.co/400" alt="" />
                    </div>
                    <div>
                        <FieldLabel>Display name</FieldLabel>
                        <FieldDescription>@username</FieldDescription>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Nebula Shops</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={"#"}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"#"}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"#"}>Dashboard</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}