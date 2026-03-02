import { NextPageWithLayout } from "@/types/global"
import PortalLayout from "@components/layouts/main-layouts/portalLayout"
import { SellerSideBar } from "../[shop_id]/[[...slug]]"
import { Button, ButtonGroup, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Field, FieldLabel, Input, Textarea } from "@components/ui/NebulaUI";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { requestCreateShop } from "@/api/shop";
import { useShopService } from "@/hooks/useShopService";
import { redirect } from "next/navigation";
import router from "next/router";


const NewShop: NextPageWithLayout = () => {
    // yeah, im lazy
    const style = {
        width: "100%",
        justifyContent: "center",
        textAlign: "center",
        marginTop: "calc(var(--spacing) * 12 )"
    } as CSSProperties;

    const buttonStyle = {
        width: "calc(var(--spacing) * 48 )",
        height: "calc(var(--spacing) * 48 )"
    } as CSSProperties;

    return(
        <Field style={style}>
            <h2>Doesn't have any shop?</h2>
            <ButtonGroup style={style}>
                <ButtonGroup>
                    <Button style={buttonStyle} variant={"outline"}>
                        Use invitation link
                    </Button>
                </ButtonGroup>
                <CreateNewShopButton>
                    <ButtonGroup>
                        <Button style={buttonStyle} variant={"outline"}>
                            Create new shop
                        </Button>
                    </ButtonGroup>
                </CreateNewShopButton>
            </ButtonGroup>
        </Field>
    )
}

interface newShopBtnProps {
    children: ReactNode
}

function CreateNewShopButton({
    children
}: newShopBtnProps) {
    //implement payload handler
    const [shopName, setShopName] = useState("");
    const [shopDescription, setShopDescription] = useState("");

    const {createShop} = useShopService()

    const handleSubmit = () => {
        const payload = {
            name: shopName,
            description: shopDescription
        }

        createShop(payload)

        router.push("/portal/seller/loading")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new shop
                    </DialogTitle>
                    <DialogDescription>
                        Create your own nebula shop.
                    </DialogDescription>
                </DialogHeader>
                <Field>
                    <FieldLabel htmlFor="shop-name">
                        Shop Name
                    </FieldLabel>
                    <Input id="shop-name" placeholder="Your shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="shop-description">
                        Shop Description (Optional)
                    </FieldLabel>
                    <Textarea id="shop-description" placeholder="Simple summary of your shop" value={shopDescription} onChange={(e) => setShopDescription(e.target.value)} />
                </Field>
                <DialogFooter>
                    <Button variant={"secondary"} size={"sm"} onClick={handleSubmit}>
                        Create New Shop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

NewShop.getLayout = (page) => {
    return <PortalLayout>{page}</PortalLayout>
}

export default NewShop;