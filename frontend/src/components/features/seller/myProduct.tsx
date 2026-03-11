import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Field,
    FieldGroup,
    FieldSeparator,
    Input,
} from "@components/ui/NebulaUI";
import s from "@styles/layouts/seller/myProduct.module.scss";
import { useEffect, useState } from "react";
import SellerProductComponent from "@components/features/seller/myProduct/productComponent";
import { getShopProducts, ProductData } from "@/api/product";
import { useRouter } from "next/router";

export default function MyProduct() {
    const router = useRouter();
    const { shop_id } = router.query;

    const [products, setProducts] = useState<ProductData[]>([]);

    useEffect(() => {
        if (!shop_id || typeof shop_id !== "string") return;

        const fetchProducts = async () => {
            const data = await getShopProducts(shop_id);
            setProducts(data);
        };

        fetchProducts();
    }, [shop_id]);

    return (
        <FieldGroup className={s.myProductPage}>
            <h2>Shop Products</h2>

            <Field className={s.myProductContainer}>
                <Field orientation={"horizontal"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"sm"}>Sort by</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem>ASC</DropdownMenuItem>
                            <DropdownMenuItem>DSC</DropdownMenuItem>
                            <DropdownMenuItem>
                                Price: low to high
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Price: high to low
                            </DropdownMenuItem>
                            <DropdownMenuItem>Out of stock</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Input type="text" placeholder="Search with Product name" />
                </Field>

                <FieldSeparator />

                <Field className={s.productContainer}>
                    {products?.map((product) => (
                        <SellerProductComponent
                            key={product.id}
                            shop_id={shop_id?.toString() ?? ""}
                            props={product}
                        />
                    ))}
                </Field>
            </Field>
        </FieldGroup>
    );
}
