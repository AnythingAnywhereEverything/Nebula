import { NebulaButton } from "@components/ui/NebulaBtn"
import cp from '@styles/features/promotionpanel.module.scss'
import React from "react";
import { ProductItem, ProductWindow } from "@components/ui/ProductWindow"
import { NerdFonts } from "@components/utilities/NerdFonts";
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



const OptionPanel: React.FC = () => {
    return (
        <div className={cp.optionalContainer}>
            <div className={cp.giftForPerson}>
                <div className={cp.giftHeader}>
                    <h2>
                        <NerdFonts>Shop gifts for someone</NerdFonts>
                    </h2>
                    <h4>
                        <Link href={"#"}>
                            <NerdFonts>Show more</NerdFonts>
                        </Link>
                    </h4>
                </div>
                {/**
                 * Holiday gifts
                 * For Best Friends
                 * Family gifts
                 * For Her
                 * For Him
                 * For Gamers
                 * For kids
                 * Couple gifts
                 * Surprise gift
                 */}
                <ul className={cp.productList}>
                    {products.map((item) => (
                          <ProductWindow
                            key={item.itemid}
                            items={[item]}
                            showInfo
                          />
                    ))}
                </ul>
            </div>
            <div className={cp.giftByPrice}>
                <div className={cp.giftHeader}>
                    <h2>
                        <NerdFonts>Shop gifts by price</NerdFonts>
                    </h2>
                    <h4>
                        <Link href={"#"}>
                            <NerdFonts>Show more</NerdFonts>
                        </Link>
                    </h4>
                </div>
                {/**
                 * Electronic
                 * Women
                 * Men
                 * Fashion
                 * Under 50$
                 * Under 25$
                 * Under 10$
                 */}
                 <ul className={cp.productList}>
                    {products.map((item) => (
                          <ProductWindow
                            key={item.itemid}
                            items={[item]}
                            showInfo
                          />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default OptionPanel;