import { Button, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field } from "@components/ui/NebulaUI";
import React from "react";
import s from "@styles/layouts/seller/myProduct.module.scss"

const SellerProductComponent:React.FC = () => {
    return(
        <Field orientation={'horizontal'} className={s.product}>
            <Checkbox />
            <Field orientation={'horizontal'}>
                <div className={s.imgContainer}>
                    <img src="https://placehold.co/200" alt="" />
                </div>
                <Field>
                    <Field className={s.productHeader}>
                        <h4>omgggggggggggggggggggggggggasjdojasodjsoajdosajodjasasdsadadasdasdasdasdasdasdasdsadasd</h4>
                    </Field>
                    <Field >
                        <div>Price: $59</div>
                        <div>Item in stock: 10</div>
                        <div className={s.variableSelector}>
                            Variants:
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button style={{minWidth: "150px"}} size={'sm'}>Variants 1</Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        Variants 2
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        Variants 3
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className={s.sizeSelector}>
                            <p>Size: </p> 
                            <Button size={'sm'}>S</Button>
                            <Button size={'sm'}>M</Button>
                        </div>
                    </Field>
                </Field>
                <Field orientation={'horizontal'}>

                    <Button>Edit</Button>
                    <Button variant={'destructive'}>Delete</Button>
                </Field>
            </Field>
        </Field>
    )
}
export default SellerProductComponent;