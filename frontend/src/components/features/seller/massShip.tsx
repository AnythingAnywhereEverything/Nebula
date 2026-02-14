import { SellerHeader, SellerLayout, SellerContent, SellerToolbarRow } from "@components/layouts/sellerPageLayout"
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel } from "@components/ui/NebulaUI"
import Form from "next/form"
import React from "react"

export default function MassShipPage (){
    return(
            <SellerLayout>
                <SellerHeader>
                    Ship My Orders
                </SellerHeader>
        
                <Field orientation={'horizontal'} style={{alignItems:"stretch"}}>
                    <Field>
                        <SellerContent>
                            <SellerToolbarRow>
                                <Button>Order to Ship</Button>
                                <Button>Generate Document</Button>
                            </SellerToolbarRow>

                            <SellerToolbarRow>
                                <div>
                                    <span>Shipping Deadline :</span>
                                </div>
                                <Button>All</Button>
                                <Button>Overdue (0)</Button>
                                <Button>Within 24h (0)</Button>
                                <Button>Beyond 24h (0)</Button>
                            </SellerToolbarRow>
        
                            <SellerToolbarRow>
                                <div>
                                    <span>Shipping Channel :</span>
                                </div>
                                <Button>NBX (0)</Button>
                                <Button>NBX Express Instant (0)</Button>
                                <Button>J&T (0)</Button>
                                <Button>FBN (0)</Button>
                            </SellerToolbarRow>

                            <SellerToolbarRow>
                                <FieldGroup>
                                    <span>Print status : </span>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button>All</Button>
                                        </DropdownMenuTrigger>
                                    </DropdownMenu>

                                </FieldGroup>
                            </SellerToolbarRow>
                        </SellerContent>
                    </Field>

                    <FieldGroup style={{width: "400px"}}>
                        <SellerContent>
                            <h4>Mass Ship</h4>
                            
                            0 parcel selected

                            <SellerContent>
                                <FieldGroup>
                                    <Field>
                                        <Field orientation={'horizontal'}>
                                            <FieldLabel>
                                                Pickup Address:
                                            </FieldLabel>   
                                            <Button size={'xs'} variant={'ghost'}>Change</Button>
                                        </Field>
                                        <p>Place 62316231472</p>
                                        <FieldDescription>
                                            742 Evergreen Terrace California United States 94107 
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>

                                <FieldGroup>
                                    <Form action={''}>
                                        <FieldLabel>
                                            Pickup Date:
                                        </FieldLabel>

                                        <Field>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size={'sm'}>
                                                        Select
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        12 Feb
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </Field>
                                    </Form>

                                    <Field >
                                        <FieldDescription style={{
                                        padding: "calc(var(--spacing)* 1.2)",
                                        border: "1px solid var(--tertiary)",
                                        borderRadius: "var(--radius)",
                                        backgroundColor: "color-mix(in oklab, var(--tertiary) 30%, transparent)"
                                        }}>
                                            Courier will refer to your avaliable pickup time to arrange pickup service
                                        </FieldDescription>
                                    </Field>

                                    <Button>Mass Arrange Pickup</Button>
                                </FieldGroup>
                            </SellerContent>

                            <SellerContent>
                                 <FieldGroup>
                                    <Field>
                                        <Field orientation={'horizontal'}>
                                            <FieldLabel>
                                                Nearest branch:
                                            </FieldLabel>   
                                            <Button size={'xs'} variant={'ghost'}>Change</Button>
                                        </Field>
                                        <p>Blahaj (200m)</p>
                                        <FieldDescription>
                                            742 Evergreen Terrace California United States 94107 
                                        </FieldDescription>
                                    </Field>
                                    <Button size={'xs'} variant={'oppose'}>
                                        Check All Braches on Map
                                    </Button>

                                    <Button>Mass Arrange Dropoff</Button>
                                </FieldGroup>
                            </SellerContent>

                        </SellerContent>
                    </FieldGroup>
                </Field>

            </SellerLayout>
    )
}