import { NebulaButton } from "@components/ui/NebulaBtn"
import convertStyle from "@components/utilities/ConvertStyles"
import nb from '@styles/ui/nebulaBthVarients/signinButton.module.scss'

const SigninButton: React.FC = () => {
    return (
        <NebulaButton 
            href="/auth/signin"
            btnValues={"Sign in"}
            className={nb.signinButton}
        />
    )
}

export default SigninButton;