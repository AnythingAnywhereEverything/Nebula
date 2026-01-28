import style from "@styles/layouts/browsingHistory.module.scss";
import { RecommendPanel } from "@components/features/recommendation";
import { ProductContainer, ProductContainerDescription, ProductContainerHeader, ProductContainerHeaderAddon, ProductContainerHeaderGroup, ProductContainerTitle, ProductField } from "@components/ui/Nebula/product-field";
import { Button } from "@components/ui/NebulaUI";

export default function BrowsingHistory() {
    return(
        <section className={style.historySection}>

            <ProductContainer>
                <ProductContainerHeader>
                    <ProductContainerHeaderGroup>
                        <ProductContainerTitle>
                            Your Browsing History
                        </ProductContainerTitle>
                        <ProductContainerDescription>
                            Manage your browing history
                        </ProductContainerDescription>
                    </ProductContainerHeaderGroup>
                    <ProductContainerHeaderAddon>
                        <Button variant={"ghost"}>Show more</Button>
                    </ProductContainerHeaderAddon>
                </ProductContainerHeader>
                <ProductField max_rows={2}/>
            </ProductContainer>

            <RecommendPanel />
        </section>
    )
}