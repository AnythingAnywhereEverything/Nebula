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


const RoleComponent : React.FC = () => {
    return (
        <SellerLayout>
            <SellerHeader>Role Editor</SellerHeader>
            <ShopSettingsCompo/>
            <Field orientation={'horizontal'}  style={{ alignItems: "stretch"}}>
                <RoleMain/>
            </Field>
        </SellerLayout>
    )
}

const RoleMain : React.FC = () => {
    const {shop_id} = useParams();
    const [countRoles, setCountRoles] = useState(1);
    const MAXROLES = 15;

    function sendRequestNewRole(id: string | string[] | undefined) {
        if (!id || Array.isArray(id)) return;
        if (allRoles === undefined) return;
        
        if (allRoles?.length >= MAXROLES) {
            return console.error("Reached max roles")
        }
        const nextCount = countRoles + allRoles.length

        setCountRoles(nextCount);
        const sendRequestPayload:RequestNewRole = {
            id: id,
            name: `New role ${countRoles}`,
            description: "",
            permission: 0
        }
        createNewRole(sendRequestPayload);
        return;
    }

    const [selectedRole, setSelectedRole] = useState<roleInfo>();
    const [allRoles, setAllRoles] = useState<roleInfo[]>();
    
    useEffect(() => {
        if (!shop_id || Array.isArray(shop_id)) return;
        
        const fetchRole = async () => {
            try{
                const data = await getShopRole(shop_id);
                setAllRoles(data);
                setCountRoles(data.length + 1)
            } catch (e) {
                console.log(e)
            }
        }
        fetchRole()
    }, [shop_id]);

     

    return (
        <Field orientation={'horizontal'}>
            <SellerContent style={{width: '400px', height: "100%"}}>
                
                <Field>
                    <Field orientation={'horizontal'}>
                        <FieldLabel>
                            Current Role: {allRoles?.length}
                        </FieldLabel>

                        {countRoles < MAXROLES ? (
                            <Button 
                            size={'sm'} 
                            variant={'ghost'}
                            onClick={() => sendRequestNewRole(shop_id)}>
                                <Icon>
                                    
                                </Icon>
                            </Button>    
                        ) : (
                            <></>
                        )}
                        
                    </Field>
                </Field>

                <Field className={s.roleContainer}>
                    <Field orientation={'horizontal'}>
                        <Field>
                            <Link href="#">
                                Role Name
                            </Link>
                        </Field>

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

                </Field>
                    <>
                        {allRoles?.map((item) => (
                            <Field orientation={'horizontal'} key={item.id}>
                                <Button variant={'destructive'}>
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
                        {selectedRole && <RoleRightSide {...selectedRole} />}
                    </>
            </SellerContent>

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
        <SellerContent style={{alignItems: "stretch"}}>
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

                        <FieldLabel>Description :</FieldLabel>
                        <Textarea 
                        placeholder="Role description"
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                        />
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
        </SellerContent>
    )
}
export default RoleComponent;