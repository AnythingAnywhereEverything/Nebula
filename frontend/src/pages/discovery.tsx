import style from "@styles/layouts/moreDiscovery.module.scss"
import { Icon, ProductField } from "@components/ui/NebulaUI";
import { ProductDatas, searchProductDatas } from "@/api/search";
import { useEffect, useState } from "react";
export default function MoreDiscovery(){    
    const [discovery, setDiscovery] = useState<ProductDatas[]>([]);
    useEffect(() => {
        async function load() {

            const discovery = await searchProductDatas(undefined, "0");
            setDiscovery(discovery.data);
        }

        load();
    }, []);
    return (
        <section className={style.moreDiscoverContainer}>
            
            <div className={style.moreDiscoverHeader}>
                <h2>
                    <Icon>More Discovery</Icon>
                </h2>
            </div>
            
            <ProductField item_display={discovery} max_rows={5}/>
        </section>
    )
}