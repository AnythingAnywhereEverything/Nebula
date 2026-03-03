import Head from "next/head";
import s from "@styles/layouts/seller/returnProduct.module.scss";
import {
    Button,
    ButtonGroup,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    Icon,
    Input,
} from "@components/ui/NebulaUI";
import { CancelRefundAction } from "@components/features/seller/cancelRefund/cancelRefundComponent";
import { useRouter } from "next/router";
import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";

export default function ShopDashboard() {
    const router = useRouter();
    const { shop_id, slug } = router.query;

    const moneyNumber = "789456"
    const money = (Number(moneyNumber)).toLocaleString('en-US'); 


    const orderNumber = "4568"
    const order = (Number(orderNumber)).toLocaleString('en-US'); 


    const userNumber = "12345"
    const user = (Number(userNumber)).toLocaleString('en-US'); 

    return (
        <SellerLayout>
            <SellerHeader>Shop Dashboard</SellerHeader>
            <Field orientation={"horizontal"}>
                <SellerContent>
                    <FieldGroup>
                        <Field orientation={"horizontal"} justify={"space-between"}>
                            <FieldDescription>
                                Total Sales
                            </FieldDescription>
                            <ButtonGroup>
                                <Button variant={"oppose"} size={"icon"}>
                                    <Icon></Icon>
                                </Button>
                            </ButtonGroup>
                        </Field>
                        <Field orientation={"horizontal"} justify={"space-between"}>
                            <h2 style={{textWrap: "nowrap", flex: 1}}>$ {money}</h2>
                            <Field style={{width: "fit-content"}}>
                                <FieldLegend style={{textAlign: "end"}} variant="label">+10%</FieldLegend>
                                <FieldDescription>vs last week</FieldDescription>
                            </Field>
                        </Field>
                    </FieldGroup>
                </SellerContent>
                <SellerContent>
                    <FieldGroup>
                        <Field orientation={"horizontal"} justify={"space-between"}>
                            <FieldDescription>
                                Total Orders
                            </FieldDescription>
                            <ButtonGroup>
                                <Button variant={"outline"} size={"icon"}>
                                    <Icon></Icon>
                                </Button>
                            </ButtonGroup>
                        </Field>
                        <Field orientation={"horizontal"} justify={"space-between"}>
                            <h2 style={{textWrap: "nowrap", flex: 1}}>{order}</h2>
                            <Field style={{width: "fit-content"}}>
                                <FieldLegend style={{textAlign: "end"}} variant="label">-5.12%</FieldLegend>
                                <FieldDescription>vs last week</FieldDescription>
                            </Field>
                        </Field>
                    </FieldGroup>
                </SellerContent>
                <SellerContent>
                    <FieldGroup>
                        <Field orientation={"horizontal"} justify={"space-between"}>
                            <FieldDescription>
                                Total Visitors
                            </FieldDescription>
                            <ButtonGroup>
                                <Button variant={"outline"} size={"icon"}>
                                    <Icon></Icon>
                                </Button>
                            </ButtonGroup>
                        </Field>
                        <Field orientation={"horizontal"} justify={"space-between"}>
                            <h2 style={{textWrap: "nowrap", flex: 1}}>{user}</h2>
                            <Field style={{width: "fit-content"}}>
                                <FieldLegend style={{textAlign: "end"}} variant="label">+18.5%</FieldLegend>
                                <FieldDescription>vs last week</FieldDescription>
                            </Field>
                        </Field>
                    </FieldGroup>
                </SellerContent>
            </Field>
        </SellerLayout>
    );
}