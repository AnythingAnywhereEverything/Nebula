import React from "react";
import style from "@styles/searcResult.module.scss"
import { NerdFonts } from "@components/utilities/NerdFonts";
import { NebulaButton } from "@components/ui/NebulaBtn";
import { useState } from "react";


const param = "Headphone";
const maxPages = 7;

interface productInfo{
    id : number,
    name : string,
    price: number,
    location :string 
}

const product: productInfo = {
  id: 1,
  name: "JOYTOY 1/18 Warhammer 40,000 Action Figure Space Wolves Intercessors, Warhammer 40K, Collection Model 4.2inch",
  price: 4299,
  location: "Bangkok",
};

function minMaxPages(currentPage : number){
    if (currentPage == 1) {

    }
}

export default function searchResult(){
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <section className={style.gridResult}>
            
            {/* Component filter */}
            <section className={style.filter}>
                <div className={style.filterHead}>
                    <h2>Icon</h2>
                    <h2>Search filter</h2>
                </div>

                <div className={style.price}>
                    <h4>Price range</h4>
                    {/*  */}
                    <div className={style.minMax}>
                        <input type="number" name="" id="" placeholder="MIN" />
                        <input type="number" name="" id="" placeholder="MAX" />
                    </div>
                </div>
            </section>
           
            
            {/* Result */}
            <section className={style.result}>
                <div className={style.searchResult}>
                    <h3>Icon</h3>
                    <h3>Search result for {param}</h3>


                </div>

                <div className={style.resultContainer}>

                    {/* flex sort by things */}
                    <div className={style.sortBar}>

                        {/* LEFT */}
                        <div className={style.sortBarLeft}>
                            <p>Sort by</p>

                            <NebulaButton isIcon 
                            className={style.sortBtnOption}
                            btnValues = "Revelant"
                            onClick={() => console.log("Revelant default")}
                            />

                            <NebulaButton isIcon 
                            className={style.sortBtnOption}
                            btnValues = "Latest"
                            onClick={()=> console.log("Set sort to Latest update")}/>

                            <NebulaButton className={`${style.selectPriceSort} ${style.sortBtnPrice}`}
                            isIcon
                            btnValues = "Price" 
                            onClick={() => console.log("Hello")}
                            btnComponent ={
                                <div className={style.priceSort}>
                                    <NebulaButton isIcon 
                                    className={style.sortBtnPrice}
                                    btnValues = "Price: Low to High" 
                                    onClick={() => console.log("Low to High")}
                                    />
                                    <NebulaButton isIcon 
                                    className={style.sortBtnPrice}
                                    btnValues = "Price: High to Low"
                                    onClick={() => console.log("High to Low")} 
                                    />
                                </div>
                                }/>
                        </div>

                        <div className={style.sortBarRight}>
                            <div className={style.sortBarRightText}>
                                <span>{currentPage}</span>
                                /
                                <span>{maxPages}</span>
                            </div>
                            {/* TODO: MIn max pages function */}
                            <NebulaButton isIcon
                            className={style.changePage}
                            btnValues="<"
                            onClick={() => setCurrentPage(current => current-1)}
                            />
                            <NebulaButton isIcon
                            className={style.changePage}
                            btnValues=">"
                            onClick={() => setCurrentPage(current => current+1)}
                            />
                        </div>
                    </div>

                    <section className={style.resultDisplay}>
                        {/* show the PRODUCT, HOLY NAMING*/}
                        <ul className={style.productDisplay}>
                            <li id="clickToProduct" className={style.productHolder}>
                                <div style={{display: "contents"}}>
                                    <div className={style.product}>
                                        {/* ITEM INFOMORATION */}
                                        <a href="#" className={style.productLink}>
                                            <section className={style.productContainer}>

                                                <div className={style.productImage}>
                                                    <img src="/temp/spaceMarine.jpg" alt="" className={style.image} />
                                                    <div className={style.sitcker}>
                                                        {/* Add some sitckerhere :D */}
                                                    </div>
                                                </div>

                                                <div className={style.productText}>

                                                </div>

                                            </section>

                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>

                    </section>
                {/* END container */}
                </div>
            </section>
        </section>
    )
}