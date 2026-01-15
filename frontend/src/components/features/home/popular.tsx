import { NebulaButton } from "@components/ui/NebulaBtn"
import React from "react";
import { ProductWindow } from "@components/ui/ProductWindow";
import style from "@styles/features/promotionpanel.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";
import { ProductItem } from "@components/ui/ProductWindow";

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
  {
    itemid: "3",
    itemtitle: "Gaming Laptop, 16.0inch Laptop Computer with AMD Ryzen 7 7730U(8C/16T, Up to 4.5GHz), 16GB RAM 512GB NVMe SSD Windows 11 Laptop, Radeon RX Vega 8 Graphics,WiFi 6, Backlit KB",
    itemprice_usd: 40,
    itemimageurl: "/images/green-tea.png",
    itemrating: 3,
    productLocation: "USA",
    itemSold: "89 sold",
  },
  
]

const PopularProduct: React.FC = () => {
    
    return(
        <section style={{width: "100%"}}>
            <div className={style.popularHeader}>
                <h2>
                    <NerdFonts>Popular in this season</NerdFonts>
                </h2>
            </div>

            <div  className={style.popularContainer}>
                <ul className={style.productList}>
                    {products.map((item) => (
                        <ProductWindow
                        key={item.itemid}
                        items={[item]}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default PopularProduct