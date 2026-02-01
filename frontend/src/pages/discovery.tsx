import style from "@styles/layouts/moreDiscovery.module.scss"
import { Icon, ProductField } from "@components/ui/NebulaUI";
export default function MoreDiscovery(){    

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