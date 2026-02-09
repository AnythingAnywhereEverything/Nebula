import { Button, DropdownMenu, DropdownMenuTrigger, Field, Input } from "@components/ui/NebulaUI";
import s from "@styles/layouts/seller/myorder.module.scss"
import React from "react";

export default function myOrder() {
    return(
        <>
            <Field className={s.myOrderPage}>
                <Field className={s.header}>
                    <h2>My Orders</h2>
                </Field>

                <Field orientation={'horizontal'}>
                    <div className={s.sortByStatus}>
                        <Button variant={'outline'}>All</Button>
                        <Button variant={'outline'}>Unpaid</Button>
                        <Button variant={'outline'}>To ship</Button>
                        <Button variant={'outline'}>Shipping</Button>
                        <Button variant={'outline'}>Completed</Button>
                        <Button variant={'outline'}>Return/Refund/Cancel</Button>
                    </div>
                </Field>

                    <Field orientation={'horizontal'} className={s.orderContainer}>
                        <Field orientation={'horizontal'}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button>OrderID</Button>
                                </DropdownMenuTrigger>
                            </DropdownMenu>

                            <Input  type="text" placeholder="Enter ID here" />
                        </Field>

                        <Field orientation={'horizontal'}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button>Shipping Type</Button>
                                </DropdownMenuTrigger>
                            
                            </DropdownMenu>
                        </Field>
                </Field>
            </Field>
        </>
    )
}