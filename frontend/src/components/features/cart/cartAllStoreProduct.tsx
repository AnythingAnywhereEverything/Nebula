import React from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import style from "@styles/layouts/cart.module.scss"

const CartAllStore: React.FC = () => {
    return(
        <div className={style.allProductHeader}>
                    
            <div className={style.productName}>
                <input type="checkbox"
                className={style.allProductCheckbox}
                />
                <span>Product</span>
            </div>

            <div className={style.unitPrice}>
                Unit price
            </div>

            <div className={style.quantity}>
                Quantity
            </div>

            <div className={style.totalPrice}>
                Total Price
            </div>

            <div className={style.deleteBtn}>
                Delete
            </div>
        </div>
    )
}

export default CartAllStore;