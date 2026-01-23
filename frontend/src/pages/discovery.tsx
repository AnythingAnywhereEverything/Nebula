import style from "@styles/layouts/moreDiscovery.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";import { NebulaButton } from "@components/ui/NebulaBtn";
import { ProductItemExamples } from "src/mocks/productItem.mock";
import NebulaProductItem from "@components/ui/NebulaProductItem";

// /page?=1


export default function MoreDiscovery(){
    const products = Array.from(ProductItemExamples).splice(0,7);
    

    return (
        <section className={style.moreDiscoverContainer}>
            
            <div className={style.moreDiscoverHeader}>
                <h2>
                    <NerdFonts>More Discovery</NerdFonts>
                </h2>
            </div>
            
            <div className={style.moreDiscoverMain}>
                <ul className={style.productList}>
                    
                    {products.map((item) => (
                        <NebulaProductItem key={item.item_id} {...item}/>
                    ))}

                </ul>
            </div>

            <div className={style.pageNumber}>
                <NebulaButton
                    className={style.previousPage}
                    btnValues=" < "
                    onClick={() => {
                        // if (currentPage > 1 ){
                        //     setSearchParams({ Page: String(currentPage - 1) });
                        // }
                }}
                    relative
                />
                    <ul className={style.numberDisplay}>
                        <NebulaButton 
                        btnValues = "1"
                        className = {style.pageSelector}
                        onClick={() => {}}
                        />
                    </ul>
                    <NebulaButton
                    className={style.continuePage}
                    btnValues = " > "
                    onClick={() => {
                        // if (currentPage < totalPages){
                            //     setSearchParams({ Page: String(currentPage + 1) });
                            // }
                    }}
                relative
                />

            </div>
        </section>
    )
}