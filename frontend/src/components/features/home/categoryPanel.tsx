import { NebulaButton } from "@components/ui/NebulaBtn"
import cp from '@styles/features/promotionpanel.module.scss'
import React from "react";



const CategoryPanel: React.FC = () => {
    return (
        <div>
            <h1>Categories</h1>
            <ul>
                <li>
                    <a href="#">
                        <img src="/icon"/>
                        <p>Cat1</p>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default CategoryPanel;