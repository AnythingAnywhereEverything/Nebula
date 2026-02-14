import { Field, FieldDescription } from "@components/ui/NebulaUI"
import React from "react"
import s from "@styles/layouts/seller/myorder.module.scss"
import OrderEditForDemo from "./orderEditDemo"
import OrderShipArrange from "./orderShipArrange"
import CheckOrderDetail from "./orderDetailButton"

const OrderRows:React.FC = () =>{
    return(
        <tbody>
            <tr>
                <td colSpan={999}>
                <Field className={s.userDisplay} orientation={'horizontal'}>
                    <Field>
                        John Lasanga
                    </Field>
                    <FieldDescription style={{width: "fit-content", whiteSpace: "nowrap"}}>
                        
                        <span>
                            Order ID: 123asf12asFvBasadsadFF
                        </span>
                    </FieldDescription>
                </Field> 
                </td>
            </tr>
            
            <tr className={s.productItem}>
              <td className={s.productCell}>
                <div className={s.productContent}>
                  <div className={s.imgContainer}>
                    <img src="https://placehold.co/200" alt="" />
                  </div>
                  <div className={s.productInfo}>
                    <div className={s.name}>Long product asdasdsadasdasdASDASDASD asdsadasdasdasdsadadssadasdasdasdasdasdsadsadadaasdadasdasdadaSADASdasdasdadasdaasdada</div>
                  </div>
                </div>
              </td>
                <td className={s.center} >$59.98</td>
                <td>
                    <div>Arrive in 1 day(s)</div>
                    <div>
                        <h4>Shipped</h4>
                        <FieldDescription>
                            Order being shipped to buyer
                        </FieldDescription>
                    </div>
                </td>
                <td className={s.center}>Express</td>
                <td style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "calc(var(--spacing) * 3 )"
                  }}>
                    <OrderEditForDemo/>
                    <OrderShipArrange/>
                    <CheckOrderDetail/>
                </td>
            </tr>
        </tbody>
    )
}

export default OrderRows;