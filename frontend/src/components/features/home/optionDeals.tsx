import { NebulaButton } from "@components/ui/NebulaBtn"
import cp from '@styles/features/promotionpanel.module.scss'
import React from "react";



const OptionPanel: React.FC = () => {
    return (
        <div>
            <div>
                <div>
                    Shop gifts for someone
                </div>
                {/**
                 * Holiday gifts
                 * For Best Friends
                 * Family gifts
                 * For Her
                 * For Him
                 * For Gamers
                 * For kids
                 * Couple gifts
                 * Surprise gift
                 */}
            </div>
            <div>
                <div>
                    Shop gifts by prices  
                </div>
                {/**
                 * Electronic
                 * Women
                 * Men
                 * Fashion
                 * Under 50$
                 * Under 25$
                 * Under 10$
                 */}
            </div>
        </div>
    )
}

export default OptionPanel;