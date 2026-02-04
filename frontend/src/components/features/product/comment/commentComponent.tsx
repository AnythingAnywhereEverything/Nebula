import { Button, ButtonGroup, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, Icon, ProductStars } from "@components/ui/NebulaUI";
import React, { useState } from "react";
import s from "@styles/ui/productComment.module.scss"
import { Comment } from "src/types/comment";
import ReactMarkdown from "react-markdown";

const CommentComponent:React.FC<Comment> = ({
    comment_id,
    user_id,
    username,
    rating,
    profile_image,

    comment_text,

    create_at,
    update_at,
    has_like,
    response 
}) => {

    const [reveal , setReveal] = useState(false);
    
    return(
        <Field orientation={'vertical'} className={s.container}>
            <Field orientation={'horizontal'} className={s.comment}>
                <div className={s.profileContainer}>
                    <img src={profile_image} alt="" />
                </div>
                <Field className={s.user}>
                    <h4>{username}</h4>
                    <ProductStars stars={rating}/>
                    <Field orientation={'horizontal'}>
                        <FieldDescription className={s.commentDate}><Icon>󰔛</Icon>
                          {(
                            update_at.getTime() !== create_at.getTime()
                              ? `Edited ${update_at.toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}`
                              : create_at.toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                            )}
                        </FieldDescription>
                    </Field>
                    <div className={s.userCommentContainer}>
                        <ReactMarkdown>{comment_text}</ReactMarkdown>
                    </div>

                    {/* IF HAS COMMENTS */}
                    {response && response.length > 0 && (
                        response.map((item, index) => (
                            <Field orientation={'horizontal'} className={s.commentParent} key={index}>
                                <div className={s.profileContainer}>
                                    <img src={item.proflie_image} alt="" />
                                </div>
                            <Field className={s.user}>
                                <h4>{item.username}</h4>
                                
                                <Field orientation={'horizontal'} className={s.dateContainer}>
                                    <FieldDescription className={s.commentDate}><Icon>󰔛</Icon>
                                    {(
                                        item.update_at.getTime() !== item.create_at.getTime()
                                          ? `Edited ${item.update_at.toLocaleString("en-GB", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })}`
                                          : item.create_at.toLocaleString("en-GB", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })
                                    )}
                                    </FieldDescription>
                                </Field>

                                    <div className={s.userCommentContainer}>
                                        <ReactMarkdown>{item.comment}</ReactMarkdown>
                                    </div>

                                </Field>
                            </Field>
                        ))
                        
                    )}
                    
                    {/*  */}
                    <Field orientation={'horizontal'}>
                        {has_like > 0 ? (
                            <Field>
                                <div>
                                    <Button className={s.reviewBtn}><Icon>󰔓</Icon>{has_like}</Button>
                                </div>
                            </Field>
                        ) : (
                            <Field>
                                <div>
                                    <Button className={s.reviewBtn}><Icon>󰔓</Icon>Helpful ?</Button>
                                </div>
                            </Field>
                            
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button><Icon>󰇙</Icon></Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuGroup>

                                    <DropdownMenuItem>
                                        Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuItem variant={'destructive'}>
                                        Delete Comment
                                    </DropdownMenuItem>

                                    <DropdownMenuItem variant="destructive" >
                                        Report abuse
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    </Field>
                </Field>
            </Field>
        </Field>
    )
}

export default CommentComponent;