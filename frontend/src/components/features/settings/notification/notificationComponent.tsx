import React, { useState } from "react";
import s from '@styles/layouts/notificationComponent.module.scss';
import { Button, ButtonGroup, Checkbox, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, Icon, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@components/ui/NebulaUI";
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
    return(
        <Link className={s.notiComponent} href={linkToPage}>
            <Field orientation={"horizontal"}>
                <Field orientation={"horizontal"}>
                    <div className={s.imageContainer}>
                        <img src={mainImage} alt="" />
                    </div>

                    <FieldGroup>
                        <FieldLegend>{title}</FieldLegend>

                        <Field>
                            <FieldDescription className={s.contentDescription}>
                                {description}
                            </FieldDescription>
                            {additionalImage?.length > 0 && (
                                <div className={s.additionImages}>
                                    {additionalImage.map((img , index) => (
                                        <div className={s.additionImagesWraper}>
                                            <img key = {index} src={img} alt="" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <FieldDescription>
                                <Icon>󰔛 </Icon> 
                                {timestamp.toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                    
                </Field>
                { hasButton && 
                    <Button variant={'outline'}>View Details</Button>
                }
            </Field>
        </Link>
    )
}

export default NotificationComponent;