import React from "react";
import style from "@styles/layouts/address.module.scss"
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Field, FieldDescription, FieldLegend, FieldSet, Separator } from "@components/ui/NebulaUI";
import AddressButton from "./newAddressButton";
import { AddressResponse, getAddresses } from "@/api/address";
import { useAddressService } from "@/hooks/useAddressService";

const AddressCard: React.FC<AddressResponse> = (props) => {
    const { id, full_name, phone_number, address_line1, address_line2, zip_code, city, state, country, is_default, phone_code } = props;

    const { deleteAddress, setDefaultAddress } = useAddressService();

    return (
        <FieldSet className={style.addressCard}>
            <Field orientation={"horizontal"} className={style.header}>
                <Field orientation={"horizontal"}>
                    <FieldLegend>
                        {full_name}
                    </FieldLegend>
                    <Separator orientation="vertical"/>
                    <FieldLegend variant="label">
                        {phone_code ? `(+${phone_code}) ${phone_number}` : phone_number}
                    </FieldLegend>
                </Field>

                <AddressButton type="edit" addressData={props} />
                {!is_default && <DeleteAddressConfirmation addressId={id} deleteAddress={deleteAddress}/>}
            </Field>
            <Field orientation={"horizontal"} className={style.cardInfo}>
                <Field>
                    <FieldLegend>{address_line2} {address_line1}</FieldLegend>
                    <FieldDescription>
                        {city}, {state}, {country}, {zip_code}
                    </FieldDescription>
                    {is_default &&
                        <p className={style.defaultAddr}>Default Address</p>
                    }
                </Field>
                {!is_default && <Button size={"sm"} onClick={() => setDefaultAddress({ address_id: id })}>Set as Default</Button>}
            </Field>
        </FieldSet>
    );
}

const DeleteAddressConfirmation: React.FC<{ addressId: string; deleteAddress: (id: string) => void }> = ({ addressId, deleteAddress }) => {

    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure you want to delete this address?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Please confirm if you want to proceed with deleting this address.
                    </DialogDescription>
                </DialogHeader>
                <Field orientation={"horizontal"} style={{justifyContent: "space-between"}}>
                    <Button variant="destructive" onClick={() => {deleteAddress(addressId); setOpen(false)}}>Yes, Delete</Button>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                </Field>
            </DialogContent>
        </Dialog>
    )
}

export default AddressCard;