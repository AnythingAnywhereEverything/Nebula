import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Field, FieldDescription, FieldLabel, FieldSeparator } from "@components/ui/NebulaUI";
import React, { useState } from "react";
import s from "@styles/ui/Nebula/dialogue.module.scss"

interface OrderDetail{

}

const CustomOverlay = ({ state }: { state: boolean }) => (
    <div
        data-state={state ? "open" : "close"}
        className={s.overlay}
    />
);

const CheckOrderDetail:React.FC = () => {
    const [open, setOpen] = useState(false);
    return (
            <Dialog
            open={open}
            onOpenChange={setOpen}
            modal={false}
            >
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'oppose'}>
                    Show Detail
                </Button>
            </DialogTrigger>

            {open && <CustomOverlay state={open} />}

            <DialogContent style={{minWidth: "900px"}}>
                <DialogHeader>
                    <DialogTitle>
                        Order details
                    </DialogTitle>
                    <DialogDescription>
                        Order ID : 123asf12asFvBasadsadFF
                    </DialogDescription>
                </DialogHeader>

                <Field>
                    <FieldLabel>Customer</FieldLabel>
                    <p>John lasanga</p>
                </Field>
                <FieldSeparator/>

                <Field>
                    <h3>Product</h3>
                    <Field orientation={'horizontal'}>
                        <div style={{
                            width: "calc(var(--spacing) * 25)",
                            aspectRatio: 1 / 1,
                            overflow: "hidden",
                            borderRadius: "var(--radius-medium)",
                            flexShrink: 0
                        }}>
                            <img style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }} 
                            src="https://placehold.co/200" alt="" />
                        </div>

                        <Field>
                            <FieldLabel style={{
                                display: "-webkit-box",
                                lineClamp: 5,
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                wordBreak: "break-all"     
                            }}>
                                Lorem ipsum dolor Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum error repellat inventore quidem neque nesciunt corrupti voluptatem, atque in accusamus iure quisquam earum, explicabo mollitia optio porro ea adipisci nostrum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sint officiis a beatae maiores harum velit cumque? Iste vero blanditiis corporis aperiam dicta distinctio, voluptate tempora et doloribus molestias soluta. sit amet consectetur adipisicing elit. Unde aliquid dolore labore consectetur illum culpa. Expedita optio reprehenderit voluptatum rerum eum voluptates, tenetur mollitia dolor voluptatem temporibus dolore totam officia!  lorem
                            </FieldLabel>
                        </Field>
                    </Field>
                    
                    <Field orientation={'horizontal'}>
                        <Field>
                            <FieldLabel>Amount</FieldLabel>
                            <FieldDescription>x 2</FieldDescription>
                            
                            <FieldLabel>Subtotal</FieldLabel>
                            <FieldDescription>$29.99</FieldDescription>
                            
                            <h3>Total Price</h3>
                            <p>59.98</p>
                        </Field>
                    </Field>
                </Field>
                <FieldSeparator/>
                
                <Field style=
                    {{
                        display: "flex",
                        flexDirection: "column",
                        gap: "calc(var(--spacing) * 3)"
                    }}>
                    <h3>Shippping</h3>

                    <FieldLabel>Shipping Channal : <span>Express</span></FieldLabel>
                            <FieldLabel>Shipping fee</FieldLabel>
                            <FieldDescription>$0.45</FieldDescription>
                        <Field>
                            <FieldLabel>Customer addresses</FieldLabel>
                            <FieldDescription>742 Evergreen Terrace 94107 </FieldDescription>
                        </Field>
                    <FieldLabel>Tracking ID : TID1244ggbdASAx</FieldLabel>
                </Field>
            </DialogContent>
        </Dialog>
    )
}

export default CheckOrderDetail;