import React from "react";
import { ProductItemExamples } from "src/mocks/productItem.mock";
import SelectorSearch from "./NebulaProductField";

const RecentlyReviewed: React.FC = () => {
    const products = Array.from(ProductItemExamples).splice(0,7);
    return (
        <SelectorSearch 
            title="Your Broswing History" 
            max_rows={1} 
            type={"customLink"} 
            link="/browsingHistory"
            text="View or edit browsing history"/>

        // <section style={{width: "100%"}}>
        //     <div className={style.recentHeader}>
        //         <h2>
        //             <NerdFonts>Your Broswing History</NerdFonts>
        //         </h2>

        //         <span>
        //             <Link href={"/browsingHistory"}>View or edit browsing history</Link>
        //         </span>
        //     </div>

        //     <div className={style.recentlyContainer}>
        //         <ul className={style.recentlyList}>
        //             {products.map((item) => (
        //                 <NebulaProductItem key={item.item_id} {...item}/>
        //             ))}
        //         </ul>
        //     </div>
        // </section>
    )
}

export default RecentlyReviewed