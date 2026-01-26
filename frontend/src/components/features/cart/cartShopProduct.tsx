import React from "react";
import s from '@styles/layouts/cart.module.scss';

interface ProductInCart {
    nsin: string;
    product_name: string;
    product_image: string;
    variant: Record<string, string>;
    availability: "in_stock" | "out_of_stock" | "low_stock";
    amount: number;
    price: number;
    checked?: boolean
    freeShipping?: boolean;
}

const CartShopProduct: React.FC<ProductInCart> = (prod)=>{
    const {
        nsin,
        product_name,
        product_image,
        variant,
        availability,
        amount,
        checked,
        price,
        freeShipping,
    } = prod;
    return(
        <div className={s.itemSection}>
            <div className={s.left}>
                <input type="checkbox" name="yes" id={nsin} defaultChecked={checked}/>
                <div className={s.imageSection}>
                    <img src={product_image} alt="" />
                </div>
                <div className={s.productDetails}>
                    <h2 className={s.productName}>{product_name}</h2>
                    <p>{availability}</p>
                    {
                        freeShipping && 
                        <p>Free Shipping</p>
                    }
                    <table className={s.variants}>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Val</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(variant).map(([key, val]) => (
                                <tr className={s.variant} key={key}>
                                    <td className={s.key}>{key}</td>
                                    <td>{val}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={s.actionContainer}>
                        <div className={s.amountSelector}>
                            <button onClick={() => {}}> - </button>
                            <input type="text" min={1} defaultValue={amount}/>
                            <button onClick={() => {}}> + </button>
                        </div>
                        <p>Delete</p>
                        <p>Save for later</p>
                        <p>Share</p>
                    </div>
                </div>
            </div>
            <div className={s.priceContainer}>
                <p>
                    {price}
                </p>
            </div>
        </div>
    )
}

export default CartShopProduct