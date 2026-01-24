import React from "react";

interface CurrentProduct{

}

interface ProductInCart {
    itemInCart : number
}

const CartShopProduct: React.FC<ProductInCart> = ({itemInCart})=>{

    if( itemInCart == 0 ) return;

    return(
        <section className="">
            <div></div>
        </section>
    )
}

export default CartShopProduct