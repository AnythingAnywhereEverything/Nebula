import { Button, Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, Icon, ProductStars } from "@components/ui/NebulaUI";
import React from "react";
import s from "@styles/ui/productComment.module.scss"
import { CommentMockUp } from "@/mocks/comment.mock";
import CommentComponent from "./comment/commentComponent";

const ProductComment:React.FC = () => {
    const no = []
    const mockup = CommentMockUp
    return(
        <>
            <section className={s.commentSection}>
                <h5 className={s.title}>Customer reviews</h5>
                <Field orientation={'horizontal'} className={s.commentFilter}>
                    <FieldSet className={s.rating}>
                        <h3>Rating</h3>
                        <ProductStars stars={4.5}/>
                    </FieldSet>

                    <Field orientation={'vertical'}>
                        <Field orientation={'horizontal'} className={s.ratingBtn}>
                                <Button className={s.sortRate} variant={'outline'}>5 Stars</Button>
                                <Button className={s.sortRate} variant={'outline'}>4 Stars</Button>
                                <Button className={s.sortRate} variant={'outline'}>3 Stars</Button>
                                <Button className={s.sortRate} variant={'outline'}>2 Stars</Button>
                                <Button className={s.sortRate} variant={'outline'}>1 Stars</Button>
                        </Field>

                        <Field orientation={'horizontal'}>
                            <Button variant={'outline'} className={s.sortRate}>With comments</Button>
                            <Button variant={'outline'} className={s.sortRate}>With images</Button>
                        </Field>

                    </Field>
                </Field>

                {/* COMMENT SECTION*/}
                {mockup.length === 0  ? (
                    <section>
                        There's no comment yet
                    </section>
                ) : (
                    mockup.map((item, index) => (
                        <CommentComponent 
                            key={index}
                            {...item}
                        />
                    )) 
                )}
                
            </section>
        </>
    )
} 

export default ProductComment