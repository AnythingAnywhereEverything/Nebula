import { Button, ButtonGroup, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, FieldGroup, FieldLabel, Input } from "@components/ui/NebulaUI";
import React, { useState } from "react";
import s from "@styles/ui/Nebula/dialogue.module.scss"
import Form from "next/form";

const CustomOverlay = ({ state }: { state: boolean }) => (
    <div
        data-state={state ? "open" : "close"}
        className={s.overlay}
    />
);
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData =  new FormData(e.currentTarget);

    const payload = {
        // Get order ID
        status: formData.get("status"),
        countdown: formData.get("")
    }
    console.log("Submit Payload: ", JSON.stringify(payload))
}

const OrderEditForDemo: React.FC = () =>{
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("To Package")
    const [countdown, setCountdown] = useState(0);

    const handleCountdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(0, Math.min(366, Number(e.target.value)));
        setCountdown(value);
    };

    const statusList = [
      "To Package",
      "Packaging",
      "Packaged",
      "To Ship",
      "Shipping",
      "Shipped"
    ]

    return(
        <Dialog
            open={open}
            onOpenChange={setOpen}
            modal={false}
            >
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'default'}>
                    Edit (Prototype)
                </Button>
            </DialogTrigger>

            {open && <CustomOverlay state={open} />}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Customer Status</DialogTitle>
                    <DialogDescription>
                        Editing Order ID: 123asf12asFvBasadsadFF
                    </DialogDescription>
                </DialogHeader>
                <Form action={'#'}
                onSubmit={(e) => {e.preventDefault(); handleSubmit(e)}} 
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "calc(var(--spacing)*3)"
                }}>
                    <FieldGroup>
                        <DropdownMenu>
                            <FieldLabel htmlFor="status">
                                Status
                            </FieldLabel>
                            <DropdownMenuTrigger
                            id="status"
                            name="status"
                            asChild
                            >
                                <Button>
                                    {status}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                {statusList.filter((s) => s !== status)
                                .map((s) => (
                                    <DropdownMenuItem style={{padding: "calc(var(--spacing)*1.5)"}} key={s} onSelect={() => setStatus(s)}>
                                    {s}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </FieldGroup>

                    <FieldGroup>
                        <FieldLabel htmlFor="countdown">
                            Countdown (1-366)
                        </FieldLabel>

                        <Input 
                        type="number"
                        placeholder="countdown (1-366)"
                        value={countdown}
                        onChange={handleCountdownChange}
                        />
                    </FieldGroup>
                    <DialogFooter>
                        <ButtonGroup>
                            <ButtonGroup>
                                <Button variant={"outline"}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button variant={'default'}>
                                    Submit
                                </Button>
                            </ButtonGroup>
                        </ButtonGroup>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default OrderEditForDemo;