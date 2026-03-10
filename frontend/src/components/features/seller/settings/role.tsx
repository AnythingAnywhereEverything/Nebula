import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";
import React, { useEffect, useState } from "react";
import ShopSettingsCompo from "./settings";
import { Button, Field, FieldDescription, FieldLabel, FieldSeparator, Icon, Input, Switch, Textarea } from "@components/ui/NebulaUI";
import s from "@styles/layouts/seller/rolesetting.module.scss"
import Link from "next/link";
import Form from "next/form";
import { createNewRole, getShopRole, RequestNewRole, UpdateShopRole } from "@/api/shop";
import { useParams } from "next/navigation";
import { randomUUID } from "crypto";
import { error } from "console";
import next from "next";

const sellerLayoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 auto',
    gap: 'calc(var(--spacing) * 4)',
    padding: 'calc(var(--spacing) * 4)',
    boxSizing: "border-box"
};

export default function RoleComponent() {
    return (
        <Field style={sellerLayoutStyle}>
            <SellerHeader>Role Editor</SellerHeader>
            <ShopSettingsCompo/>
            <Field orientation={'horizontal'}  style={{ alignItems: "stretch"}}>
                <RoleMain/>
            </Field>
        </Field>
    )
}

const RoleMain : React.FC = () => {
    const {shop_id} = useParams();
    const [cooldown, setCooldown] = useState(false);
    const MAXROLES = 15;
    const [selectedRole, setSelectedRole] = useState<roleInfo | null>(null);
    const [allRoles, setAllRoles] = useState<roleInfo[]>();


    async function sendRequestNewRole(id: string | string[] | undefined) {
        if (!id || Array.isArray(id)) return;
        if (allRoles === undefined) return;
        if (allRoles?.length >= MAXROLES) {
            return console.error("Reached max roles")
        }
        const nextCount = (1 + allRoles.length)
        setCooldown(true)

        const sendRequestPayload:RequestNewRole = {
            name: `New role ${nextCount}`,
            description: "",
            permissions: 0
        }
        await createNewRole(id ,sendRequestPayload);
        const data = await getShopRole(id);
        setAllRoles(data);

        setTimeout(() => {
            setCooldown(false);
        }, 500);
    }

    useEffect(() => {
        if (!shop_id || Array.isArray(shop_id)) return;
        
        const fetchRole = async () => {
            try{
                const data = await getShopRole(shop_id);
                setAllRoles(data);
            } catch (e) {
                console.log(e)
            }
        }
        fetchRole()
    }, [shop_id]);

    return (
        <Field orientation={'horizontal'} stretch>
            <SellerContent style={{width: '400px'}}>
                <Field>
                    <Field orientation={'horizontal'}>
                        <FieldLabel>
                            Current Role: {allRoles?.length}
                        </FieldLabel>

                        {/* // * What a mess */}
                        {allRoles?.length != undefined && allRoles?.length <= MAXROLES && cooldown === false && (
                            <Button size={'sm'} variant={'ghost'}
                            onClick={() => sendRequestNewRole(shop_id)}
                            >
                                <Icon></Icon>
                            </Button>
                        )}
                        
                        {cooldown && (
                            <Button size={'sm'} variant={'ghost'}>
                                <Icon>󰇘</Icon>
                            </Button>
                        )}
                    </Field>
                </Field>

                    <>
                        {allRoles?.map((item) => (
                            <Field orientation={'horizontal'} key={item.id}>
                                <Button variant={'destructive'}
                                onClick={() => setSelectedRole(item)}>
                                    <Field>
                                        {item.name}
                                    </Field>
                                </Button>

                                <Button 
                                size={'xs'} 
                                variant={'ghost'}
                                onClick={() => console.log(allRoles?.length)}
                                >
                                    <Icon>
                                        
                                    </Icon>
                                </Button>
                            </Field>
                        ))}
                    </>
            </SellerContent>

            {selectedRole && <RoleRightSide {...selectedRole} />}
        </Field>
    )
}

type roleInfo = {
    id:string,
    name: string,
    description: string,
    permission: number
}
const RoleRightSide: React.FC<roleInfo> = (payload) => {
    const [roleName, setRoleName] = useState(payload.name)
    const [roleDescription, setRoleDescription] = useState(payload.description)
    const [bit, setBit] = useState<number | null>(payload.permission)


    useEffect(() => {
        setRoleName(payload.name)
        setRoleDescription(payload.description)
        setBit(payload.permission)
    }, [payload])
    
    const permissionList =[{
            Name: "Manage shop",
            Description: "Permission to manage shop settings and configurations",
            bit: 1 << 0
        },{
            Name: "Manage products",
            Description: "Permission to manage products in the shop",
            bit: 1 << 1
        },{
            Name: "Manage orders",
            Description: "Permission to manage orders in the shop",
            bit: 1 << 2
        },{
            Name: "Manage customers",
            Description: "Permission to manage customers in the shop",
            bit: 1 << 3
        },{
            Name: "View reports",
            Description: "Permission to view sales and performance reports for the shop",
            bit: 1 << 4
        }]

    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [newBit, setNewBit] = useState<number | null>(null);

    return (
        <SellerContent>
            <Field>
                <FieldLabel>
                    Permission
                </FieldLabel>
                <FieldSeparator/>
                <Form action={"#"}>
                    <Field style={{paddingBlock: 'calc(var(--spacing) * 4)'}}>
                        <Field style={{marginBottom: 'calc(var(--spacing) * 2)'}}>
                            <FieldLabel>Name :</FieldLabel>
                            <Input 
                            placeholder="Role name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            />    
                        </Field>

                    </Field>            
        
                    <FieldSeparator/>
                    <Field>
                        {permissionList.map((item, index) => ( 
                            <Field orientation={'horizontal'} key={index}> 
                                <Field style={{
                                    paddingBlock: 'calc(var(--spacing) * 4)'
                                }}>
                                    <FieldLabel>{item.Name}</FieldLabel>
                                    <FieldDescription>{item.Description}</FieldDescription>
                                </Field>
                                <Switch value={item.bit} />
                            </Field>
                        ))}
                    </Field>
                </Form>
            </Field>

            <FieldSeparator/>
            <Field>

            </Field>
        </SellerContent>
    )
}