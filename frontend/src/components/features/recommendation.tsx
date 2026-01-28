import { ProductContainer, ProductContainerHeader, ProductContainerTitle, ProductContainerDescription, ProductContainerHeaderAddon, ProductField, ProductContainerHeaderGroup } from "@components/ui/Nebula/product-field";
import { Button } from "@components/ui/NebulaUI";

export function RecommendPanel() {
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
            <ProductField max_rows={1}/>
        </ProductContainer>
    )
}