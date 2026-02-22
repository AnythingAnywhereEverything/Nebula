import { Checkbox, Field, FieldDescription } from "@components/ui/NebulaUI"
import React from "react"
import s from "@styles/layouts/seller/myorder.module.scss"
import MassPrintOptions from "./massPrintOption"

const MassOrderRow:React.FC = () =>{
    return(
        <tbody>

            <tr className={s.productTable}>
                <td>
                    <Checkbox/>
                </td>
                <td className={s.imgContainer}>
                    <img src="https:/placehold.co/200" alt="" />
                </td>
                <td>
                    John Longnameeeeeee
                </td>
                <td>
                    Express
                </td>
                <td className={s.confirmTime}>
                    <p>20/10/2026</p>
                    <p>20.31</p>
                </td>
                <td className={s.massShipStatus}>
                    <p>Please ship or order will be cancelled on 25/10/2026</p>
                    <div style={{
                        padding: "var(--spacing)",
                        backgroundColor: "var(--tertiary)",
                        borderRadius: "var(--radius-extra-small)"
                        }}>
                        <p>Cancel in 5 days</p>
                    </div>
                </td>
                <td>
                    <MassPrintOptions/>
                </td>
            </tr>
        </tbody>
    )
}

export default MassOrderRow;