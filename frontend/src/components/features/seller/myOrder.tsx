import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, FieldDescription, FieldLabel, FieldSeparator, Input } from "@components/ui/NebulaUI";
import s from "@styles/layouts/seller/myorder.module.scss"
import React from "react";
import { OrderSearchSort, OrderShippingSort } from "./order/orderActionPopup";
import { SellerHeader, SellerLayout, SellerPanel, SellerPanelHeader, SellerContent, SellerToolbarRow } from "@components/layouts/sellerPageLayout";
import OrderRows from "./order/orderRow";

export default function myOrder() {
    return(
            <SellerLayout>
                <SellerHeader>
                    My Orders
                </SellerHeader>

                <SellerContent>
                    <SellerToolbarRow>
                        <Button variant={'outline'}>All</Button>
                        <Button variant={'outline'}>Unpaid</Button>
                        <Button variant={'outline'}>To ship</Button>
                        <Button variant={'outline'}>Shipping</Button>
                        <Button variant={'outline'}>Completed</Button>
                        <Button variant={'outline'}>Return/Refund/Cancel</Button>
                    </SellerToolbarRow>

                    <SellerToolbarRow>
                        <OrderSearchSort/>
                        <OrderShippingSort/>
                    </SellerToolbarRow>
                </SellerContent>

                {/* Order component */}
                <SellerPanel>
                    <SellerPanelHeader>
                        <h4>1 Orders</h4>
                    </SellerPanelHeader>

                    <FieldSeparator/>
                    <Field>
                        <table className={s.productTable}>
                          <thead>
                            <tr className={s.tableHead}>
                              <th style={{width:"35%"}}>Product(s)</th>
                              <th style={{width:"10%"}}>Total Buyer Payment</th>
                              <th style={{width:"25%"}}>Status</th>
                              <th style={{width:"10%"}}>Shipping Channel</th>
                              <th style={{width:"20%"}}>Action</th>
                            </tr>
                          </thead>
                            
                        <OrderRows/>
                        <OrderRows/>
                    </table>
                </Field>
            </SellerPanel>
        </SellerLayout>
    )
}