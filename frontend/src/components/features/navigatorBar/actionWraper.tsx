import { NebulaButton } from "@components/ui/NebulaBtn"
import convertStyle from "@components/utilities/ConvertStyles"
import nb from '@styles/ui/nebulaButton.module.scss'
import SigninButton from "./actions/signinButton"

import navDesktop from '@styles/layouts/navbarDesktop.module.scss'

const ActionWraper: React.FC = () => {
    return (
    <div className={navDesktop.navActions}>
        <SigninButton/>
        <NebulaButton 
            isIcon 
            href="/wishlist" 
            btnValues={""}
            className={
                convertStyle(
                    nb.icon,
                    nb.buttonDark
                )
            }
        />
        <NebulaButton 
            isIcon 
            href="/gifts" 
            btnValues={"󰹄"}
            className={
                convertStyle(
                    nb.icon,
                    nb.buttonDark
                )
            }
        />
        <NebulaButton 
            isIcon
            notificationCount={5} 
            href="/cart" 
            btnValues={""}
            className={
                convertStyle(
                    nb.icon,
                    nb.containRelativeComponent,
                    nb.buttonDark
                )
            }
        />
    </div>

    )
}

export default ActionWraper;