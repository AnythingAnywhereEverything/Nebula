import React from "react";
import style from "../../styles/cart.module.scss"
import { NebulaButton } from '@components/ui/NebulaBtn';
import { useState } from "react";
// inp Array
// PARAMETER later


function ItemInShop(){
    const [quantity_testing, setQuantity] = useState(1);

    return (
        
        <section className={style.itemFromShop}>
                <input style={{width: "20px"}} type="checkbox" />
            <div className={style.itemInfo}>
                <div className={style.fakeItemImg}></div>
                <div>
                    <p>asdkodoakadsokaaassaazvzvdoas</p>
                </div>
            </div>

            <p>THB65</p>
            <div className={style.quantity}>
                <NebulaButton isIcon btnValues = "-" onClick={() => {
                    setQuantity(prev => prev - 1)
                    if (quantity_testing <= 1) {
                        console.log("Remove this item warn")
                        setQuantity(1);
                    }
                }} />
                <p>{quantity_testing}</p>
                <NebulaButton isIcon btnValues = "+" onClick={() => setQuantity(prev => prev + 1)}/>
            </div>
            <p>THB65</p>
            <p>Delete</p>
        </section>
    )
}

// PARAMETER later
function CurrentShop(){
    return (
        <div className={style.fromShop}>
            <div className={style.fromShopHeader}>
                <input type="checkbox"/>
                <h4>Shop name</h4>
            </div>
            
            <section >
                <ItemInShop />
            </section>
        </div>
    )
}
// Shop contain items from current shop
// From shop, item from current shop
// checkbox for active and inactive to buy that item
// name, qty, price and remove button 

export default function LoadingItemInCart(){
    return(

        // Checkbox for add everything active everything in cart
        
        // SHOP
        <CurrentShop />
    )
}