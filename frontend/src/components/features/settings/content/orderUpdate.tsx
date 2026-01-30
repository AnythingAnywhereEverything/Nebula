import React from "react";
import style from "@styles/layouts/orderUpdate.module.scss"
import Link from "next/link";
import { Icon } from "@components/ui/NebulaUI";


const OrderUpdate: React.FC = () => {
    return(
        <section className={style.orderContainer}>

            <div className={style.order}>
                <div className={style.productImg}>
                    <img src="https://placehold.co/400" alt="" />
                </div>

                <div className={style.productInfo}>
                    <h3>Order Confirm</h3>
                    
                    <div className={style.productBottom}>
                        {/* How to set page to product page */}
                        <p>
                            Payment for order <Link href="#">Order number</Link> has been confirmed and 
                            we've notified the seller. Kindly wait for your shipment.
                        </p>
                        <div className={style.time}>
                            <Icon>󱎫</Icon> <span>1/28/2026</span> <span>18.30</span>
                        </div>
                    </div>

                </div>
            </div>

            

            <div className={style.order}>
                <div className={style.productImg}>
                    <img src="https://placehold.co/400" alt="" />
                </div>

                <div className={style.productInfo}>
                    <h3>Order Cancelled</h3>
                    
                    <div className={style.productBottom}>
                        <p>
                            Order <Link href="#">Order number</Link> has been cancelled as 
                            your payment could not be verified.
                        </p>
                        <div className={style.time}>
                            <Icon>󱎫</Icon> <span>1/18/2026</span> <span>01.30</span>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
}

export default OrderUpdate;