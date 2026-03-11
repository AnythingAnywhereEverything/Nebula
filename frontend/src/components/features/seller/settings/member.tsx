import { getShopMember } from "@/api/shop";
import { Field } from "@components/ui/NebulaUI";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Member {
    id: string,
    shop_id: string,
    role: string
}

export default function ShopMember() {
    const { shop_id } = useParams()
    const [memberList, setMemberList] = useState<Member[]>()

    useEffect(() => {
        if (!shop_id || Array.isArray(shop_id)) return;
        
        const fetchMember = async () => {
            try {
                const fetchMember = await getShopMember(shop_id);
                setMemberList(fetchMember)
            } catch (e) {
                console.error(e)
            }
        }
        fetchMember();
    }, [shop_id])

    return (
        <Field>

        </Field>
    )
}

const MemberComponent:React.FC<Member> = ({
    id,
    shop_id,
    role
}) => {
    return (
        <Field>
            <Field orientation={'horizontal'}>
                
            </Field>
        </Field>
    )
}