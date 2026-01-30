import React from "react";
import style from "@styles/layouts/address.module.scss"
import { AddressInfo } from "src/types/address";
import { Button, Field, FieldDescription, FieldLegend, FieldSet, Separator } from "@components/ui/NebulaUI";

const AddressCard: React.FC<AddressInfo> = ({
    name,
    internationalPrefix,
    phoneNumber,
    addressLocal,
    addressInter,
    postal_code
}) => {
    return (
        <FieldSet className={style.addressCard}>
            <Field orientation={"horizontal"} className={style.header}>
                <Field orientation={"horizontal"}>
                    <FieldLegend>
                        {name}
                    </FieldLegend>
                    <Separator orientation="vertical"/>
                    <FieldLegend variant="label">
                        ({internationalPrefix}) {phoneNumber}
                    </FieldLegend>
                </Field>
                <Button variant={"outline"} size={"sm"}>Edit</Button>
            </Field>
            <Field orientation={"horizontal"} className={style.cardInfo}>
                <Field>
                    <FieldLegend>{addressInter} {postal_code}</FieldLegend>
                    <FieldDescription>
                        <p>{addressLocal} {postal_code}</p>
                    </FieldDescription>
                </Field>
                <Button size={"sm"}>Set as Default</Button>
            </Field>
        </FieldSet>
    );
}

export default AddressCard;