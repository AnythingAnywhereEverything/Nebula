import React, { useState } from "react";
import s from '@styles/layouts/notificationComponent.module.scss';
import { Button, ButtonGroup, Checkbox, Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, Icon, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@components/ui/NebulaUI";
import Link from "next/link";

interface notification{
    linkToPage: string
    title : string
    description: string
    mainImage : string
    additionalImage? : string[]
    hasButton?: boolean
    timestamp: Date
}

const NotificationComponent:React.FC<notification> = ({
    linkToPage,
    title,
    description,
    mainImage,
    additionalImage =[],
    hasButton,
    timestamp
}) =>{



    if (hasButton === false){
        return(
            <Link className={s.notiComponent} href={linkToPage}>
                <div className={s.imageContainer}>
                    <img src={mainImage} alt="" />
                </div>

                <div className={s.details}>
                    <div>
                        <h3>{title}</h3>
                    </div>

                    <div className={s.bottomContent}>
                        <p className={s.contentDescription}>{description}</p>
                        {additionalImage?.length > 0 && (
                            <div className={s.additionImages}>
                                {additionalImage.map((img , index) => (
                                    <div className={s.additionImagesWraper}>
                                        <img key = {index} src={img} alt="" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className={s.timestampWraper}>
                            <p>
                            <Icon>󰔛</Icon> 
                            {timestamp.toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                            </p>

                        </div>
                    </div>
                    
                </div>
            </Link>
        )
    }
    return(
        
        <Link className={s.notiComponent} href={'#'}>
            <div className={s.imageContainer}>
                <img src={mainImage} alt="" />
            </div>

            <div className={s.details}>
                <div>
                    <h3>{title}</h3>
                </div>

                <div className={s.bottomContent}>
                    <p className={s.contentDescription}>{description}</p>
                    {additionalImage?.length > 0 && (
                        <div className={s.additionImages}>
                            {additionalImage.map((img , index) => (
                                <div className={s.additionImagesWraper}>
                                    <img key = {index} src={img} alt="" />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={s.timestampWraper}>
                        <p>
                        
                        <Icon>󰔛</Icon> 
                        {timestamp.toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}

                        </p>
                    </div>

                </div>
                
            </div>
            <div className={s.viewBtn}>
                <Button variant={'outline'}>View Details</Button>
            </div>
        </Link>
    )
}

export default NotificationComponent;