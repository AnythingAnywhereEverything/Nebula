import { Button, ButtonGroup, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel } from "@components/ui/NebulaUI";
import React from "react";
import s from "@styles/layouts/seller/myProduct.module.scss"
import { Badge } from "@components/ui/Nebula/badge";
import { ProductData } from "@/api/product";
import Image from "next/image";

const SellerProductComponent:React.FC<ProductData> = (props: ProductData) => {

    return(
        <FieldLabel>
            <Field orientation={'horizontal'} className={s.product}>
                <Checkbox />
                <Field orientation={'horizontal'}>
                    <div className={s.imgContainer}>
                        <Image fill src={`/cdn/${props.image_url}`} alt="" />
                    </div>
                    <FieldGroup className={s.prodDetail}>
                        <h4 className={s.prodTitle}>{props.name}</h4>
                        <div>
                            Status : {
                                props.is_active ?
                                <Badge color="#51dc7fd2" size={"sm"}>Active</Badge>
                                :
                                <Badge color="#dc5151d2" size={"sm"}>Deactive</Badge>
                            }
                            <FieldDescription style={{display: "flex",flexDirection: "column", gap: "calc(var(--spacing) * 2)"}}>
                                <br />
                                Total stock : {props.total_stock}
                                <br />
                                Variant : {props.variant_count}
                            </FieldDescription>
                        </div>
                    </FieldGroup>
                    <ButtonGroup>
                        <ButtonGroup>
                            <Button>Edit</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button variant={'destructive'}>Delete</Button>
                        </ButtonGroup>
                    </ButtonGroup>
                </Field>
            </Field>
        </FieldLabel>
    )
}
export default SellerProductComponent;