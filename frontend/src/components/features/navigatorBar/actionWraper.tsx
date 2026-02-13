import navDesktop from '@styles/layouts/navbarDesktop.module.scss'
import { Button } from "@components/ui/NebulaUI"
import Link from "next/link"
import { cn } from "src/lib/utils"
import { Icon } from "@components/ui/Nebula/icon"
import { ProfileBadge } from '../profileBadge'
import { isAuthenticated } from 'src/handler/token_handler'
import { useEffect, useState } from 'react'

const ActionWraper: React.FC = () => {

    const [Authenticated, setAuthenticated] = useState(false);

     useEffect(() => {
        setAuthenticated(isAuthenticated());
    }, []);

    return (
    <div className={navDesktop.navActions}>

        {
            !Authenticated ? (
                <Button variant={"oppose"} asChild>
                    <Link href={"/auth/signin"}>Sign in</Link>
                </Button>
            )
            :
            <ProfileBadge/>
        }
        


        <Button asChild className={cn(navDesktop.buttonDark)} size={"icon-lg"}>
            <Link href={"/wishlist"}>
                <Icon value=""/>
            </Link>
        </Button>
        <Button asChild className={cn(navDesktop.buttonDark)} size={"icon-lg"}>
            <Link href={"/gifts"}>
                <Icon value="󰹄"/>
            </Link>
        </Button>
        <Button asChild className={cn(navDesktop.buttonDark, navDesktop.containBadge)} size={"icon-lg"}>
            <Link href={"/cart"}>
                <Icon value=""/>
                <span className={navDesktop.notificationBadge}>5</span>
            </Link>
        </Button>
    </div>

    )
}

export default ActionWraper;