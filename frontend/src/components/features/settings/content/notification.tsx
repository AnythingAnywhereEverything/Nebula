import React from "react";
import style from "@styles/layouts/notification.module.scss"
import { NebulaButton } from "@components/ui/NebulaBtn";
import { Switch } from "@components/ui/Nebula/switch";

const Notification: React.FC = () => {
    return(
        <section className={style.notiContainer}>
            <div className={style.getEmailNoti}>
                
                <div className={style.email}>
                    <div>
                        <h2>Email Notification</h2>
                        <p>Important notification cannot be turn off</p>
                    </div>
                    <Switch size='lg'/>
                </div>

                <ul>
                    <li className={style.promotion}>
                        <div>
                            <h3>Promotion</h3>
                            <p>Updates on upcoming deals</p>
                        </div>
                        <Switch size='lg'/>
                    </li>

                    <li className={style.order}>
                        <div>
                            <h3>Order update</h3>
                            <p>Updates on shipping and delivery status of all orders</p>
                        </div>
                        <Switch size='lg'/>

                    </li>
                    
                    <li className={style.survey}>
                        <div >
                            <h3>Customer Survey</h3>
                            <p>Recevice survey</p>
                        </div>
                        <Switch size='lg'/>

                    </li>

                </ul>

            </div>
            <div className={style.messageNoti}>
                <div>
                    <h2>Message Notification</h2>
                    <p>Recive message from seller and customer</p>
                </div>
                    <Switch size='lg'/>    
            </div>
        </section>
    )
}

export default Notification