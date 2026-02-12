import { Button, ButtonGroup, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel } from "@components/ui/NebulaUI";
import React from "react";
import s from "@styles/layouts/seller/myProduct.module.scss"
import { Badge } from "@components/ui/Nebula/badge";

const SellerProductComponent:React.FC = () => {
    return(
        <FieldLabel>
            <Field orientation={'horizontal'} className={s.product}>
                <Checkbox />
                <Field orientation={'horizontal'}>
                    <div className={s.imgContainer}>
                        <img src="https://placehold.co/200" alt="" />
                    </div>
                    <FieldGroup className={s.prodDetail}>
                        <h4 className={s.prodTitle}>omgggggggggggggggggggggggggasjdojasodjsoajdosajodjasasdsadadasdasdasdasdasdasdasdsadasd</h4>

                        <FieldDescription style={{display: "flex",flexDirection: "column", gap: "calc(var(--spacing) * 2)"}}>
                            <p>
                                Status : <Badge color="#51dc7fd2" size={"sm"}>Active</Badge>
                            </p>
                            <p>Stock : 10</p>
                            <p>Variant : 3</p>
                            <p>Global Category : Jewelry</p>
                            <p>Shop Category : Bracelet</p>
                        </FieldDescription>
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