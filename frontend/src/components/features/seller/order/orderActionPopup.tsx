import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, Input } from "@components/ui/NebulaUI";
import React from "react";

const OrderSearchSort:React.FC = () => {
    return(
        <Field orientation={'horizontal'}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>OrderID</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>

                    <DropdownMenuItem>
                        OrderID
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                        Buyer Name
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                        Product
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        Tracking Number
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        Return Request ID
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        Return Tracking No
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <Input  type="text" placeholder="Enter ID here" />
        </Field>

    )
}

const OrderShippingSort:React.FC = () => {
    return(
        <Field orientation={'horizontal'}>
            <p>
                Shipping Channel
            </p>
            <DropdownMenu>
                
                <DropdownMenuTrigger asChild>
                    <Button>Shipping Type</Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent>
                    
                    <DropdownMenuItem>
                        Express Shipping
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                        Standard Delivery
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        Standard Delivery Bulky
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                        Others
                    </DropdownMenuItem>
                
                </DropdownMenuContent>
            </DropdownMenu>
        </Field>
    )
}
export {
    OrderSearchSort,
    OrderShippingSort
}