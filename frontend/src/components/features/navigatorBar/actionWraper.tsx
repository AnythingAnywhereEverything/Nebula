import nb from '@styles/ui/nebulaButton.module.scss'

import navDesktop from '@styles/layouts/navbarDesktop.module.scss'
import { Button } from "@components/ui/NebulaUI"
import Link from "next/link"
import { cn } from "src/lib/utils"
import { Icon } from "@components/ui/Nebula/icon"
import { ProfileBadge } from '../profileBadge'

const ActionWraper: React.FC = () => {
    return (
    <div className={navDesktop.navActions}>
        <Button variant={"oppose"} asChild>
            <Link href={"/auth/signin"}>Sign in</Link>
        </Button>

        <ProfileBadge/>

        <Button asChild className={cn(nb.buttonDark)} size={"icon-lg"}>
            <Link href={"/wishlist"}>
                <Icon value=""/>
            </Link>
        </Button>
        <Button asChild className={cn(nb.buttonDark)} size={"icon-lg"}>
            <Link href={"/gifts"}>
                <Icon value="󰹄"/>
            </Link>
        </Button>
        <Button asChild className={cn(nb.buttonDark, nb.containBadge)} size={"icon-lg"}>
            <Link href={"/cart"}>
                <Icon value=""/>
                <span className={nb.notificationBadge}>5</span>
            </Link>
        </Button>
    </div>

    )
}

export default ActionWraper;