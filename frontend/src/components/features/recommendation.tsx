import { ProductDatas, searchProductDatas } from "@/api/search";
import { ProductContainer, ProductContainerHeader, ProductContainerTitle, ProductContainerDescription, ProductContainerHeaderAddon, ProductField, ProductContainerHeaderGroup } from "@components/ui/Nebula/product-field";
import { Button } from "@components/ui/NebulaUI";
import { useState, useEffect } from "react";

export function RecommendPanel() {
    const [discovery, setDiscovery] = useState<ProductDatas[]>([]);
    useEffect(() => {
        async function load() {

            const discovery = await searchProductDatas(undefined, "0");
            setDiscovery(discovery.data);
        }

        load();
    }, []);
    return (
        <ProductContainer>
            <ProductContainerHeader>
                <ProductContainerHeaderGroup>
                    <ProductContainerTitle>
                        Recommended for you
                    </ProductContainerTitle>
                    <ProductContainerDescription>
                        Your daily recommendation feed
                    </ProductContainerDescription>
                </ProductContainerHeaderGroup>
                <ProductContainerHeaderAddon>
                    <Button variant={"ghost"}>Show more</Button>
                </ProductContainerHeaderAddon>
            </ProductContainerHeader>
            <ProductField item_display={discovery} max_rows={1}/>
        </ProductContainer>
    )
}