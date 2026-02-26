import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";
import { FieldDescription, Field, FieldLabel,
        Input, FieldGroup, DropdownMenu,
        DropdownMenuTrigger, Button, DropdownMenuContent,
        DropdownMenuItem, 
        InputGroupText,
        Textarea,
        FieldSeparator,
        Icon} from "@components/ui/NebulaUI";
import Form from "next/form";
import React, { useState } from "react";

export default function AddNewProduct() {

    const [productItem, setProductItem] = useState (1); //max 20 variant
    const [productName, setProductName] = useState("");
    const [SKU, setSKU] = useState("");
    const [productVariant, setProductVariant] = useState('none');
    
    const [sepecification, setSpecification] = useState (1); // max 5 sepec
    
    
    return(
        <SellerLayout>
            <SellerHeader>Add new product</SellerHeader>
            <Field orientation={'horizontal'} style={{alignItems: 'stretch'}}>
                <Field>
                    <SellerContent>
                        <Form action={'#'}>
                            <Field>
                                {/* Parent item*/}
                                <FieldGroup>
                                    <Field>
                                        <FieldGroup>
                                            <FieldLabel>Product Name</FieldLabel>
                                            <Input id="add-product-name" placeholder="Product name here"/>
                                            <FieldLabel>Product About</FieldLabel>
                                            <Textarea id="add-product-about" placeholder="About product"/>
                                        </FieldGroup>
                                            <FieldSeparator/>
                                        <FieldGroup>
                                            <FieldLabel>Specification</FieldLabel>
                                            <Field>
                                                <table style={{
                                                    width: "100%",
                                                    tableLayout: 'auto',
                                                    borderSpacing: "calc(var(--spacing)*2)",
                                                    }}>
                                                    <thead>
                                                        <tr style={{
                                                            textAlign: 'left',
                                                            }}>
                                                            <th >
                                                                Specification Name
                                                            </th>
                                                            <th>
                                                                Specification Info
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr>
                                                            <td style={{width: "50%"}}>
                                                                <Input placeholder="Name"/>
                                                            </td>
                                                            <td style={{width: "50%"}}>
                                                                <Input placeholder="Info"/>
                                                            </td>
                                                            <td>
                                                                <Button variant={'destructive'}>
                                                                    <Icon></Icon>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>                                         
                                            </Field>
                                        </FieldGroup>
                                    </Field>
                                </FieldGroup>
                            </Field>
                        </Form>
                    </SellerContent>
                </Field>

                <Field style={{width: "400px", alignItems: 'stretch'}}>
                    <SellerContent>
                        <FieldGroup>
                            
                        </FieldGroup>
                    </SellerContent>
                </Field>

            </Field>
        </SellerLayout>
    )
}