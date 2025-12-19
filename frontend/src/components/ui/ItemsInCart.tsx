import React from "react";
import style from "../../styles/cart.module.scss"

// inp Array
function ItemInShop(){
    return (
        <div className={style.cartItem}>
            <input type="checkbox" />
            <div className={style.fakeImg}></div>
                        
        </div>
    )
}

function CurrentShop(){
    return (
        <div className={style.fromShop}>
            <div>
                <input type="checkbox" />
                <h4>Shop name</h4>
            </div>

            <ItemInShop />
        </div>
    )
}
// Shop contain items from current shop
// From shop, item from current shop
// checkbox for active and inactive to buy that item
// name, qty, price and remove button 

export default function LoadingItemInCart(){
    return(
        // SHOP
        <CurrentShop />
    )
}