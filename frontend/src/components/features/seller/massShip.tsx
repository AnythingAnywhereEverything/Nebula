import { SellerHeader, SellerLayout, SellerContent, SellerToolbarRow, SellerPanel } from "@components/layouts/sellerPageLayout"
import { Button, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, Input, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@components/ui/NebulaUI"
import Form from "next/form"
import style from "@styles/features/filterbar.module.scss"
import s from "@styles/layouts/seller/myorder.module.scss"
import React, { useState } from "react"
import { MassShipRight, MassShipShowMore } from "./order/massShipComponent"
import { useSearchParams } from "next/navigation"
import MassOrderRow from "./order/massOrderRow"


export default function MassShipPage (){
    const [showMore, setShowMore] = useState(false);
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams.toString());
    const sortType = searchParams.get('sort') || '';

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
                                <Button size={'sm'}>All</Button>
                                <Button size={'sm'}>Overdue (0)</Button>
                                <Button size={'sm'}>Within 24h (0)</Button>
                                <Button size={'sm'}>Beyond 24h (0)</Button>
                            </SellerToolbarRow>
        
                            <SellerToolbarRow>
                                <div>
                                    <span>Shipping Channel :</span>
                                </div>
                                <Button size={'sm'}>NBX (0)</Button>
                                <Button size={'sm'}>NBX Express Instant (0)</Button>
                                <Button size={'sm'}>J&T (0)</Button>
                                <Button size={'sm'}>FBN (0)</Button>
                            </SellerToolbarRow>

                            <MassShipShowMore isOpen={showMore}/>
                            <SellerToolbarRow>
                                <Field orientation={'horizontal'} style={{justifyContent: 'flex-end'}}>
                                    <Button
                                    variant={'ghost'}
                                    size={'sm'}
                                    onClick={() => setShowMore(prev => !prev)}>
                                        {showMore ? "Hide filters" : "Show more filter"}
                                    </Button>
                                </Field>
                            </SellerToolbarRow>
                        </SellerContent>

                        <SellerPanel>
                            <Field orientation={'horizontal'}>
                                <Field>
                                    <h4>2 Parcels</h4>
                                </Field>

                                <Select 
                                value={sortType === 'price_asc' || sortType === 'price_desc' ? sortType : ""}
                                onValueChange={(val) => {
                                    currentParams.set('sort', val);
                                }}
                                >
                                    <SelectTrigger
                                        className={(sortType === 'ASC-SKU' || sortType === 'DSC-SKU') ? style.active : ""}
                                        style={{color: "var(--secondary-foreground)",
                                         backgroundColor: "var(--secondary)",
                                         borderRadius: "var(--radius-small)",
                                         minWidth: "calc(var(--spacing)*48)"
                                         }}>
                                        <SelectValue placeholder="Sort by SKU (ASC)"/>
                                    </SelectTrigger>

                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectLabel>Price</SelectLabel>
                                            <SelectItem value='ASC-SKU'>Sort by SKU (ASC)</SelectItem>
                                            <SelectItem value='DSC-SKU'>Sort by SKU (DSC)</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                                <FieldSeparator/>
                            
                                <Field>
                                     <table className={s.productTable}>
                                        <thead>
                                          <tr className={s.tableHead}>
                                            <th style={{width: '5%'}}><Checkbox/></th>
                                            <th >Product(s)</th>
                                            <th >Buyer</th>
                                            <th >Channel</th>
                                            <th >Confirmed Time</th>
                                            <th >Order Status</th>
                                            <th >Print Status</th>
                                          </tr>
                                        </thead>
                                        
                                        <MassOrderRow/>
                                        <MassOrderRow/>
                                    </table>
                                </Field>
                            </SellerPanel>
                        </Field>
                    <MassShipRight/>
                </Field>

                

            </SellerLayout>
    )
}