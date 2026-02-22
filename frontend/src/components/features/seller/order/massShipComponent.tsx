import { SellerContent, SellerToolbarRow } from "@components/layouts/sellerPageLayout";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel, Input } from "@components/ui/NebulaUI";
import Form from "next/form";
import React from "react";

const MassShipRight: React.FC = () =>{
    return (
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
    )
}

interface showMore{
    isOpen : boolean
}
const MassShipShowMore: React.FC<showMore> = ({isOpen}) => {
    if (!isOpen) return;
    
    return(
        <Field>
            <SellerToolbarRow>
                <Field orientation={'horizontal'} >
                    <span>Print status : </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={'sm'} style={{width: "225px"}}>All</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                something
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Field>
                
                <Field orientation={'horizontal'}>
                    <span>Parcel Content : </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={'sm'} style={{width: "225px"}}>All</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                something
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Field>
            </SellerToolbarRow>
        <SellerToolbarRow>
            <span>Order Confirm Time</span>
            <Field orientation={'horizontal'}>
                <Field>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={'sm'}>
                                Select Time
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                nothing
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Field>
                <span>-</span>
                <Field>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={'sm'}>
                                Select Time
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                nothing
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </Field>
            </Field>
        </SellerToolbarRow>
        <SellerToolbarRow>
            <span>Search</span>
            <Input type="text" placeholder="search with ID / Name / Sku"/>
        </SellerToolbarRow>
    </Field>
    )
}

export {MassShipRight,
        MassShipShowMore,

}