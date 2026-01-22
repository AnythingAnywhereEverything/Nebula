import React from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import style from "@styles/features/recentlyReview.module.scss"
import PL from "@styles/ui/productWindow.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";
import { ProductItem, ProductWindowProps } from "@components/ui/ProductWindow";
import Link from "next/link";

const products: ProductItem[] = [
  {
    itemid: "1",
    itemtitle: "Travel Essentials,4 in 1 for Apple Watch Charger/iPhone Charger/Multi Charging Cable,Vacation RV Camping Essentials,USB C/L/Micro Portable Charger for iWatch 11-1/iPhone 17-12,Car&Gift-4FT",
    itemprice_usd: 25,
    itemimageurl: "/images/chocolate.png",
    itemrating: 4.5,
    productLocation: "USA",
    itemSold: "120 sold",
  },
  {
    itemid: "2",
    itemtitle: "2 Pack Napkin Holder for Table, Gold Ginkgo Leaf Flat Iron Napkin Holder with Weighted Arm, Cocktail Paper Holder for Kitchen Dining Room Decor 7.09 L X 7.09 W X 2.76 H",
    itemprice_usd: 40,
    itemimageurl: "/images/green-tea.png",
    itemrating: 3,
    productLocation: "USA",
    itemSold: "89 sold",
  },
  {
    itemid: "3",
    // itemtitle: "Gaming Laptop, 16.0inch Laptop Computer with AMD Ryzen 7 7730U(8C/16T, Up to 4.5GHz), 16GB RAM 512GB NVMe SSD Windows 11 Laptop, Radeon RX Vega 8 Graphics,WiFi 6, Backlit KB",
    itemtitle:"Ice",
    itemprice_usd: 40,
    itemimageurl: "/images/green-tea.png",
    itemrating: 3,
    productLocation: "USA",
    itemSold: "89 sold",
  },

]
const RecentlyReviewed: React.FC = () => {
    return (
        <section style={{width: "100%"}}>
            <div className={style.recentHeader}>
                <h2>
                    <NerdFonts>Your Broswing History</NerdFonts>
                </h2>

                <span>
                    <Link href={"/browsingHistory"}>View or edit browsing history</Link>
                </span>
            </div>

            <div className={style.recentlyContainer}>
                <ul className={style.recentlyList}>
                    {products.map((item) => (
                        <RecentlyProduct 
                            key={item.itemid}
                            items={[item]}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}

const RecentlyProduct: React.FC<ProductWindowProps> = (props) => {
    return(
        <>
        {props.items.map((item) => (
            <li key={item.itemid}>
                <div className={PL.product}>
                    <Link href="#" className={PL.productLink}>
                      <section className={PL.productContainer}>
                        <div className={PL.productImage}>
                          <img src="https://placehold.co/300" alt=""/>
                        </div>
                          
                      </section>
                    </Link>
                  </div>
            </li>
        ))}
        </>
    )
}

export default RecentlyReviewed