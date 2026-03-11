import {
    Button,
    ButtonGroup,
    Field,
    FieldDescription,
    FieldGroup,
} from "@components/ui/NebulaUI";
import React from "react";
import s from "@styles/layouts/seller/myProduct.module.scss";
import { Badge } from "@components/ui/Nebula/badge";
import { deleteProduct, ProductData } from "@/api/product";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SellerProductComponent: React.FC<{
    props: ProductData;
    shop_id: string;
}> = ({ props, shop_id }: { props: ProductData; shop_id: string }) => {
    const router = useRouter();

    return (
        <Field orientation={"horizontal"} className={s.product}>
            <Field orientation={"horizontal"}>
                <div className={s.imgContainer}>
                    <Image fill src={`/cdn/${props.image_url}`} alt="" />
                </div>
                <FieldGroup className={s.prodDetail}>
                    <h4 className={s.prodTitle}>{props.name}</h4>
                    <div>
                        Status :{" "}
                        {props.is_active ? (
                            <Badge color="#51dc7fd2" size={"sm"}>
                                Active
                            </Badge>
                        ) : (
                            <Badge color="#dc5151d2" size={"sm"}>
                                Deactive
                            </Badge>
                        )}
                        <FieldDescription
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "calc(var(--spacing) * 2)",
                            }}
                        >
                            <br />
                            Total stock : {props.total_stock}
                            <br />
                            Variant : {props.variant_count}
                        </FieldDescription>
                    </div>
                </FieldGroup>
                <ButtonGroup>
                    <ButtonGroup>
                        <Button asChild>
                            <Link
                                href={`/portal/seller/${shop_id}/products/edit_product?id=${props.id}`}
                            >
                                Edit
                            </Link>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                deleteProduct(shop_id, props.id);
                                router.refresh();
                            }}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </ButtonGroup>
            </Field>
        </Field>
    );
};
export default SellerProductComponent;
