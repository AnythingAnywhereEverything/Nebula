import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/NebulaUI";
import React from "react";

const CancelRefundAction:React.FC = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger style={{width: "100%"}} asChild>
                <Button size={'sm'}>Select status</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem>
                    Reply to buyer
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Provide evidence
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Withdraw parcel
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Validate item
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Offer partial refund
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Offer full refund
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Request item return
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Review Refund Approved by Nebula
                </DropdownMenuItem>

                <DropdownMenuItem>
                    Claim shipping fee
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const StatusDropdown:React.FC = () => {
    return (
        <DropdownMenu>
            <DropdownMenuItem>

            </DropdownMenuItem>
        </DropdownMenu>
    )
}
export {CancelRefundAction,
        StatusDropdown
};