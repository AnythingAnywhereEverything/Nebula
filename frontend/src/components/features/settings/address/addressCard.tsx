import React from "react";
import style from "@styles/layouts/address.module.scss"
import { AddressInfo } from "src/types/address";
import { Button, Field, FieldDescription, FieldLegend, FieldSet, Separator } from "@components/ui/NebulaUI";

const AddressCard: React.FC<AddressInfo> = ({
    full_name,
    phonecode,
    phone,
    address_line1,
    address_line2,
    postal,
    city,
    state,
    country,
    is_default
}) => {
    return (
        <FieldSet className={style.addressCard}>
            <Field orientation={"horizontal"} className={style.header}>
                <Field orientation={"horizontal"}>
                    <FieldLegend>
                        {full_name}
                    </FieldLegend>
                    <Separator orientation="vertical"/>
                    <FieldLegend variant="label">
                        ({phonecode.startsWith('+') ? phonecode : '+' + phonecode}) {phone}
                    </FieldLegend>
                </Field>
                <Button variant={"outline"} size={"sm"}>Edit</Button>
            </Field>
            <Field orientation={"horizontal"} className={style.cardInfo}>
                <Field>
                    <FieldLegend>{address_line2} {address_line1}</FieldLegend>
                    <FieldDescription>
                        {city}, {state}, {country}, {postal}
                    </FieldDescription>
                    {is_default &&
                        <p className={style.defaultAddr}>Default Address</p>
                    }
                </Field>
                {!is_default && <Button size={"sm"}>Set as Default</Button>}
            </Field>
        </FieldSet>
    );
}

export default AddressCard;