import React from "react";
import style from '../../styles/layouts/itemCompo.module.scss';

// Mockup item
type Product = {
    id: number,
    name: string,
    price: number
};

const mockProducts: Product[] = [
    { id: 1, name: "Wireless Mouse", price: 399.12 },
    { id: 2, name: "Mechanical Keyboard", price: 1999.5 },
    { id: 3, name: "USB-C Hub", price: 899 },
    { id: 4, name: "Laptop Stand", price: 749.99 },
    { id: 5, name: "Noise Cancelling Headphones", price: 3499.0 },
    { id: 6, name: "Webcam Full HD", price: 1299.25 },
    { id: 7, name: "Portable SSD 1TB", price: 4299.8 },
    { id: 8, name: "Bluetooth Speaker", price: 1599.45 },
    { id: 9, name: "Ergonomic Office Chair", price: 8999 },
    { id: 10, name: "USB-C Fast Charger", price: 699.1 },

    { id: 11, name: "Gaming Mouse Pad XL", price: 299.5 },
    { id: 12, name: "USB-C Cable 2m", price: 199.99 },
    { id: 13, name: "Smart LED Desk Lamp", price: 899.75 },
    { id: 14, name: "Laptop Cooling Pad", price: 649.3 },
    { id: 15, name: "Noise Cancelling Earbuds", price: 2499.0 },
];

export function PriceDisplay({ price }: { price: number }) {
    const [whole, fraction] = price.toFixed(2).split(".");

    return (
        <div className={style.priceDisplay}>
            <p>฿{whole}<span>.{fraction}</span></p>
        </div>
    );
}

export default function itemComponent() {
    return (
        <div className={style.bottomRecommendBox}>
            <h3>Recommended for you</h3>
            <div className={style.container}>
                <ul>
                    {mockProducts.map(product => (
                        <li key={product.id}>
                            <div className={style.fakeImg}></div>
                            <div className={style.itemInfo}>
                                    <h5>{product.name}</h5>
                            </div>
                            <PriceDisplay price={product.price} />
                            <button>Add to cart</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}