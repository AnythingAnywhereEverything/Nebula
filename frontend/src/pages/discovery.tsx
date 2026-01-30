import style from "@styles/layouts/moreDiscovery.module.scss"
import { Icon, ProductField } from "@components/ui/NebulaUI";import { NebulaButton } from "@components/ui/NebulaBtn";
import { ProductItemExamples } from "src/mocks/productItem.mock";
import NebulaProductItem from "@components/ui/NebulaProductItem";

// /page?=1


export default function MoreDiscovery(){
    const products = Array.from(ProductItemExamples).splice(0,7);
    

    return (
        <section className={style.moreDiscoverContainer}>
            
            <div className={style.moreDiscoverHeader}>
                <h2>
                    <Icon>More Discovery</Icon>
                </h2>
            </div>
            
            <ProductField max_rows={5}/>
        </section>
    )
}