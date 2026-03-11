import { Button, ButtonGroup, Field } from "@components/ui/NebulaUI";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const ShopSettingsCompo:React.FC = () => {
    const {shop_id} = useParams();
    return (
        <Field orientation={'horizontal'}>
            <ButtonGroup style={{gap: 'calc(var(--spacing) * 2)'}}>
                <div>
                    <Link href={`/portal/seller/${shop_id}/settings`}>
                        <Button>
                            Basic info
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link href={`/portal/seller/${shop_id}/settings/role`}>
                        <Button>
                            Role
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link href={`/portal/seller/${shop_id}/settings/member`}>
                        <Button>
                            Member
                        </Button>
                    </Link>
                </div>
            </ButtonGroup>
        </Field>
    )
}

export default ShopSettingsCompo;