import Head from "next/head";
import s from "@styles/layouts/seller/returnProduct.module.scss"
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldLabel, FieldSeparator, Input } from "@components/ui/NebulaUI";
import {CancelRefundAction} from "@components/features/seller/cancelRefund/cancelRefundComponent";

export default function CancelRefunedReturn() {
    return (
        <section>
            <Field className={s.returnProductPage}>
                <Field className={s.header}>
                    <h2>All/Refund/Cancellation</h2>
                </Field>
                {/* COMPONENT */}

                <div className={s.sortByStatus}>
                    <Button variant={'outline'}>All</Button>
                    <Button variant={'outline'}>Return/Refund</Button>
                    <Button variant={'outline'}>Cancellation</Button>
                    <Button variant={'outline'}>FailDelivery</Button>
                </div>

                <Field orientation={'vertical'} className={s.returnProductContainer}>
                    <div className={s.sortByStatus}>
                        <Button variant={'outline'}>All</Button>
                        <Button variant={'outline'}>Under review</Button>
                        <Button variant={'outline'}>Returning</Button>
                        <Button variant={'outline'}>Refunded</Button>
                        <Button variant={'outline'}>Disputed</Button>
                        <Button variant={'outline'}>Rejected/Cancelled</Button>
                        <Button variant={'outline'}>Claimed</Button>
                    </div>

                    <FieldSeparator/>

                    <Field orientation={'vertical'} style={{gap: "calc(var(--spacing) * 4)"}}>
                        <Field orientation={'horizontal'}>
                            <p>Priority : </p>
                            <Button>All</Button>
                            <Button>Due in 1 day</Button>
                            <Button>Due in 2 days</Button>
                        </Field>

                        <Field orientation={'horizontal'}>
                            <p>Key Action : </p>
                            <Button>Reply to buyer</Button>
                            <Button>Provide evidence</Button>
                            <Button>Withdraw Parcel</Button>
                            <Button>Review Refund Approved by Nebula</Button>
                            <Button>Claim shipping fee</Button>
                        </Field>
                    </Field>
                    
                    <Field>
                        <Field orientation={'horizontal'}>
                            <Field orientation={'horizontal'}>
                                <p>Track by ID</p>
                                <FieldLabel>
                                    <Input type="text" placeholder="Request ID and Order ID for " />
                                </FieldLabel>
                            </Field>

                            <Field orientation={'horizontal'}>
                                <p>Action</p>

                                <FieldLabel>
                                    <CancelRefundAction />
                                </FieldLabel>

                            </Field>

                        </Field>
                    </Field>

                    <FieldSeparator/>
                    {/*  */}
                    <Field>
                        <h4>0 Request</h4>
                    </Field>
                </Field>
                

            </Field>
        </section>
    )
}