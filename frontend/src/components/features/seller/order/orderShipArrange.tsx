import { Button, Dialog, DialogContent, DialogTrigger, Field, FieldDescription } from "@components/ui/NebulaUI";
import React, { useState } from "react";
import s from "@styles/ui/Nebula/dialogue.module.scss"

const CustomOverlay = ({ state }: { state: boolean }) => (
    <div
        data-state={state ? "open" : "close"}
        className={s.overlay}
    />
);

const OrderShipArrange: React.FC =() => {
        const [open, setOpen] = useState(false);
    
    return(
        <Dialog
            open={open}
            onOpenChange={setOpen}
            modal={false}
            >
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'ghost'}>
                    Ship arrange
                </Button>
            </DialogTrigger>

            {open && <CustomOverlay state={open} />}

            <DialogContent style={{minWidth: "600px"}}>
                <h3>Ship Arrangment</h3>
                <Field orientation={'horizontal'}>
                    <Field style={{minHeight: "300px"}}>
                        <Field>
                            <h4>I Will Arrange Drop-Off</h4>
                            {/* NLX has no meaning just random */}
                            <Field>
                                <FieldDescription>
                                    You can drop your parcel at any NBX Express Drop of points
                                </FieldDescription>
                            </Field>
                        </Field>
                    </Field>

                    <Field style={{minHeight: "300px"}}>
                        <Field>
                            <h4>I Will Arrange PickUp</h4>
                            {/* NLX has no meaning just random */}
                            <Field>
                                <FieldDescription>
                                    NBX Express will collect parcel from your pickup address
                                </FieldDescription>
                            </Field>
                        </Field>
                    </Field>

                </Field>
                <Field>
                    <Button onClick={() => setOpen(false)} variant={'default'}>
                        Confirm
                    </Button>
                </Field>
            </DialogContent>
        </Dialog>
    )
}

export default OrderShipArrange;