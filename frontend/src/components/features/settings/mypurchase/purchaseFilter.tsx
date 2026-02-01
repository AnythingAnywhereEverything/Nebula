import { Button, ButtonGroup, Field } from "@components/ui/NebulaUI";
import React, {useState} from "react";
import s from "@styles/layouts/mypurchase.module.scss"
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import path from "path";
const MyPurchaseFilter: React.FC = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams.toString());
    const sortType = searchParams.get('sort') || 'all';

    return (
        <section className={s.purchaseFilter}>
            <Field orientation={'horizontal'} className={s.purchaseContainer}>
                <Field>
                    <Button
                    variant={sortType === 'all' ? 'default' : 'secondary'}
                    onClick={() => {
                        currentParams.set('sort', 'all')
                        router.push(`${pathName}?${currentParams.toString()}`)
                    }}>All</Button>
                </Field> 

                <Field>
                    <Button
                    variant={sortType === 'toShip' ? 'default' : 'secondary'}
                    onClick={() => {
                        currentParams.set('sort', 'toShip')
                        router.push(`${pathName}?${currentParams.toString()}`)
                    }}>To Ship
                    </Button>
                </Field>

                <Field>
                    <Button
                    variant={sortType === 'toReceive' ? 'default' : 'secondary'}
                    onClick={() => {
                        currentParams.set('sort', 'toReceive')
                        router.push(`${pathName}?${currentParams.toString()}`)
                    }}>To Receive</Button>
                </Field>

                <Field>
                    <Button
                    variant={sortType === 'completed' ? 'default' : 'secondary'}
                    onClick={() => {
                        currentParams.set('sort', 'completed')
                        router.push(`${pathName}?${currentParams.toString()}`)
                    }}>Completed</Button>
                </Field>

                <Field>
                    <Button
                    variant={sortType === 'cancelled' ? 'default' : 'secondary'}
                    onClick={() => {
                        currentParams.set('sort', 'cancelled')
                        router.push(`${pathName}?${currentParams.toString()}`)
                    }}>Cancelled</Button>
                </Field>

                <Field>
                    <Button
                    variant={sortType === 'refund' ? 'default' : 'secondary'}
                    onClick={() => {
                        currentParams.set('sort', 'refund')
                        router.push(`${pathName}?${currentParams.toString()}`)
                    }}>Return Refund</Button>
                </Field>

            </Field>
        </section>
    )
}

export default MyPurchaseFilter;