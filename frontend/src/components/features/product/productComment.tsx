import {
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Field,
    FieldDescription,
    FieldLegend,
    FieldSeparator,
    Icon,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@components/ui/NebulaUI";
import React, { useEffect, useState } from "react";
import s from "@styles/ui/productComment.module.scss";
import ps from "@styles/layouts/productlayout.module.scss";
import Avatar from "@components/ui/Nebula/avatar";
import { ratingStars, timeAgo } from "@lib/utils";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { queryReplies, queryReviews, reactReview, uploadReply, uploadReview } from "@/api/review";

export type CommentProps = {
    id: string;
    profile_picture_url: string | undefined;
    display_name: string | undefined;
    replies_count: string;
    likes: string;
    dislikes: string;
    rating: string;
    content: string;
    created_at: string;
    updated_at: string;

    //* Current user data
    user_reaction: "like" | "dislike" | undefined
};

export type ReplyProps = {
    id: string,
    profile_picture_url: string | undefined;
    display_name: string | undefined;
    likes: string;
    dislikes: string;
    content: string;
    created_at: string;
    updated_at: string;
    
    //* Current user data
    user_reaction: "like" | "dislike" | undefined
};

const Reply: React.FC<ReplyProps> = ({
    id,
    profile_picture_url,
    display_name,
    likes,
    dislikes,
    content,
    created_at,
    updated_at,
    user_reaction,
}) => {
        const [reaction, setReaction] = useState<"like" | "dislike" | undefined>(user_reaction)
    const [likeCount, setLikeCount] = useState(Number(likes))
    const [dislikeCount, setDislikeCount] = useState(Number(dislikes))

    const sendReaction = async (type: "like" | "dislike" | "none") => {
        await reactReview(id, { reaction: type })
    }

    const handleLike = async () => {
        let next: "like" | "none" = reaction === "like" ? "none" : "like"

        if (reaction === "like") setLikeCount(v => v - 1)
        if (reaction === "dislike") {
            setDislikeCount(v => v - 1)
            setLikeCount(v => v + 1)
        }
        if (!reaction) setLikeCount(v => v + 1)

        setReaction(next === "like" ? "like" : undefined)

        await sendReaction(next)
    }

    const handleDislike = async () => {
        let next: "dislike" | "none" = reaction === "dislike" ? "none" : "dislike"

        if (reaction === "dislike") setDislikeCount(v => v - 1)
        if (reaction === "like") {
            setLikeCount(v => v - 1)
            setDislikeCount(v => v + 1)
        }
        if (!reaction) setDislikeCount(v => v + 1)

        setReaction(next === "dislike" ? "dislike" : undefined)

        await sendReaction(next)
    }

    return (
        <div className={s.commentContainer}>
            <div className={s.replyUserProfile}>
                <Avatar src={profile_picture_url} size={32} />
            </div>
            <div className={s.commentContent}>
                <Field orientation={"horizontal"}>
                    <FieldLegend variant="label">@{display_name}</FieldLegend>
                    <FieldDescription>
                        {timeAgo(created_at)}
                    </FieldDescription>
                </Field>
                <FieldDescription>{content}</FieldDescription>
                <ButtonGroup>
                    <ButtonGroup>
                        <Button size={"sm"} variant={"ghost"} onClick={handleLike}>
                            {
                                reaction === "like"
                                ? <Icon>󰔓</Icon>
                                : <Icon>󰔔</Icon>
                            }
                            {likeCount > 0 && likeCount}
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup>
                        <Button size={"sm"} variant={"ghost"} onClick={handleDislike}>
                            {
                                reaction === "dislike"
                                ? <Icon>󰔑</Icon>
                                : <Icon>󰔒</Icon>
                            }
                            {dislikeCount > 0 && dislikeCount}
                        </Button>
                    </ButtonGroup>
                </ButtonGroup>
            </div>
        </div>
    );
};

const Comment: React.FC<CommentProps & {product_id: string}> = ({
    product_id,
    id,
    profile_picture_url,
    display_name,
    replies_count,
    likes,
    dislikes,
    rating,
    content,
    created_at,
    updated_at,
    user_reaction
}) => {

    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState("")

    const { data, isLoading } = useUser();


    const [replies, setReplies] = useState<ReplyProps[]>([])
    const [replyPage, setReplyPage] = useState(0)
    const [replyHasMore, setReplyHasMore] = useState(true)
    const [replyLoading, setReplyLoading] = useState(false)
    const [showReplies, setShowReplies] = useState(false)

    const onSubmit = async () => {
        const payload = {
            content: replyText
        }
        await uploadReply(product_id, id, payload)

        const optimisticReply = {
            id: "temp-" + Date.now(),
            content: replyText,
            display_name: data?.display_name,
            profile_picture_url: data?.profile_picture_url,
            likes: "0",
            dislikes: "0",
            created_at: new Date().toISOString(),
            updated_at: "",
            user_reaction: undefined
        }

        setReplies(prev => [optimisticReply, ...prev])
    }

    const fetchReplies = async (pageNumber: number) => {
        if (replyLoading) return

        setReplyLoading(true)

        const data = await queryReplies(product_id, id, pageNumber)

        setReplies(prev => {
            if (pageNumber === 0) return data.replies
            return [...prev, ...data.replies]
        })

        setReplyHasMore(data.has_more)
        setReplyPage(pageNumber)
        setReplyLoading(false)
    }

    const [reaction, setReaction] = useState<"like" | "dislike" | undefined>(user_reaction)
    const [likeCount, setLikeCount] = useState(Number(likes))
    const [dislikeCount, setDislikeCount] = useState(Number(dislikes))

    const sendReaction = async (type: "like" | "dislike" | "none") => {
        await reactReview(id, { reaction: type })
    }

    const handleLike = async () => {
        let next: "like" | "none" = reaction === "like" ? "none" : "like"

        if (reaction === "like") setLikeCount(v => v - 1)
        if (reaction === "dislike") {
            setDislikeCount(v => v - 1)
            setLikeCount(v => v + 1)
        }
        if (!reaction) setLikeCount(v => v + 1)

        setReaction(next === "like" ? "like" : undefined)

        await sendReaction(next)
    }

    const handleDislike = async () => {
        let next: "dislike" | "none" = reaction === "dislike" ? "none" : "dislike"

        if (reaction === "dislike") setDislikeCount(v => v - 1)
        if (reaction === "like") {
            setLikeCount(v => v - 1)
            setDislikeCount(v => v + 1)
        }
        if (!reaction) setDislikeCount(v => v + 1)

        setReaction(next === "dislike" ? "dislike" : undefined)

        await sendReaction(next)
    }

    return (
        <div className={s.commentReplyContainer}>
            <div className={s.commentContainer}>
                <div className={s.commentProfile}>
                    <div className={s.userProfile}>
                        <Avatar src={profile_picture_url} size={50} />
                    </div>
                    {Number(replies_count) > 0 && (
                        <div className={s.replyBar} />
                    )}
                </div>
                <div className={s.parentContainer}>
                    <div className={s.commentContent}>
                        <Field orientation={"horizontal"}>
                            <FieldLegend>@{display_name}</FieldLegend>
                            <FieldDescription>
                                {timeAgo(created_at)}
                            </FieldDescription>
                            <FieldDescription>
                                <Icon className={ps.star}>
                                    {ratingStars(Number(rating))}
                                </Icon>
                            </FieldDescription>
                        </Field>
                        <FieldDescription>{content}</FieldDescription>
                        <ButtonGroup>
                            <ButtonGroup>
                                <Button size={"sm"} variant={"ghost"} onClick={handleLike}>
                                    {
                                        reaction === "like"
                                        ? <Icon>󰔓</Icon>
                                        : <Icon>󰔔</Icon>
                                    }
                                    {likeCount > 0 && likeCount}
                                </Button>
                            </ButtonGroup>

                            <ButtonGroup>
                                <Button size={"sm"} variant={"ghost"} onClick={handleDislike}>
                                    {
                                        reaction === "dislike"
                                        ? <Icon>󰔑</Icon>
                                        : <Icon>󰔒</Icon>
                                    }
                                    {dislikeCount > 0 && dislikeCount}
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button size={"sm"} variant={"ghost"} onClick={() => setShowReply(v => !v)}>
                                    Reply
                                </Button>
                            </ButtonGroup>
                        </ButtonGroup>
                        {showReply && (
                            <InputGroup style={{width: "50%"}}>
                                <InputGroupTextarea
                                    style={{minHeight: "calc(var(--spacing) * 2 )"}}
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={v => setReplyText(v.target.value)}
                                />

                                <InputGroupAddon align="block-end">
                                    <InputGroupButton
                                        style={{marginLeft: "auto"}}
                                        size={"xs"}
                                        variant={"oppose"}
                                        onClick={() => {
                                            onSubmit()
                                            setReplyText("")
                                            setShowReply(false)
                                        }}
                                    >
                                        Reply
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        )}
                    </div>
                    {showReplies && (
                        <div className={s.replyGroup}>
                            {replies.map((reply) => (
                                <Reply
                                    key={reply.id}
                                    id={reply.id}
                                    profile_picture_url={reply.profile_picture_url}
                                    display_name={reply.display_name}
                                    likes={reply.likes}
                                    dislikes={reply.dislikes}
                                    content={reply.content}
                                    created_at={reply.created_at}
                                    updated_at={reply.updated_at}
                                    user_reaction={reply.user_reaction}
                                />
                            ))}

                            {replyHasMore && (
                                <Button
                                    size={"xs"}
                                    variant={"ghost"}
                                    onClick={() => fetchReplies(replyPage + 1)}
                                >
                                    Show more replies
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {
                Number(replies_count) > 0
                &&
                <div className={s.replyButtonGroup}>
                    <div className={s.replyCorner}>
                        <div className={s.cornerContainer}>
                            <div className={s.replyBlob} />
                        </div>
                    </div>
                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() => {
                            if (!showReplies) {
                                fetchReplies(0)
                            }
                            setShowReplies(v => !v)
                        }}
                    >
                        {showReplies ? "Hide replies" : `${replies_count} Replies`}
                        <Icon>{showReplies ? "" : ""}</Icon>
                    </Button>
                </div>
            }
        </div>
    );
};

type ProductCommentProp = {
    product_id: string
}

const ProductComment: React.FC<ProductCommentProp> = ({product_id}) => {
    const router = useRouter();
    const { data, isLoading } = useUser();

    function handleSubmit() {
        setOpen(true)
    }

    const [reviews, setReviews] = useState<CommentProps[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)

    const fetchReviews = async (pageNumber: number) => {
        if (loading) return

        setLoading(true)

        const data = await queryReviews(product_id, pageNumber);

        console.log(data)

        setReviews(prev => [...prev, ...data.reviews])
        setHasMore(data.has_more)
        setLoading(false)
    }

    useEffect(() => {
        setReviews([])
        setPage(0)
        setHasMore(true)

        fetchReviews(0)
    }, [product_id])

    const [open, setOpen] = useState(false)
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(5) // * default rating

    const onCommentSubmit = async () => {
        const payload = {
            content: comment,
            rating: rating
        }

        await uploadReview(product_id, payload);
        setOpen(false)

        const optimisticComment = {
            id: "temp-" + Date.now(),
            rating: rating.toString(),
            content: comment,
            replies_count: "0",
            display_name: data?.display_name,
            profile_picture_url: data?.profile_picture_url,
            likes: "0",
            dislikes: "0",
            created_at: new Date().toISOString(),
            updated_at: "",
            user_reaction: undefined
        }

        setReviews(prev => [optimisticComment,...prev])
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    {!data ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Sign in required</DialogTitle>
                            </DialogHeader>

                            <p>You must sign in to leave a review.</p>

                            <DialogFooter>
                                <Button onClick={() => router.push("/auth/signin")}>
                                    Sign in
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>Rate this product</DialogTitle>
                            </DialogHeader>

                            <Field orientation={"horizontal"} justify={"center"}>
                                {[1,2,3,4,5].map((star) => (
                                    <Button
                                        key={star}
                                        size={"icon-lg"}
                                        variant={"ghost"}
                                        onClick={() => setRating(star)}
                                    >
                                        <Icon
                                            className={
                                                star <= rating
                                                    ? s.star
                                                    : ""
                                            }
                                        >
                                            
                                        </Icon>
                                    </Button>
                                ))}
                            </Field>

                            <DialogFooter>
                                <Button size={"sm"} onClick={onCommentSubmit}>
                                    Submit rating
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <section className={s.commentSection}>
                <h5 className={s.title}>Customer reviews</h5>

                <Field className={s.userCommenting} orientation={"horizontal"}>
                    <div className={s.userProfile}>
                        <Avatar size={50} src={data?.profile_picture_url} />
                    </div>

                    <InputGroup style={{width: "100%"}}>
                        <InputGroupTextarea 
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={v => setComment(v.target.value)}
                        />

                        <InputGroupAddon align="block-end">
                            <InputGroupButton
                                style={{marginLeft: "auto"}}
                                variant={"oppose"}
                                onClick={handleSubmit}
                            >
                                Submit
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>

                <FieldSeparator />

                {reviews.length === 0 ? (
                    <section>There's no comment yet</section>
                ) : (
                    reviews.map((review, index) => (
                        <Comment
                            product_id={product_id}
                            key={review.id}
                            id={review.id}
                            profile_picture_url={review.profile_picture_url}
                            display_name={review.display_name}
                            replies_count={review.replies_count}
                            likes={review.likes}
                            dislikes={review.dislikes}
                            rating={review.rating?.toString() ?? "0"}
                            content={review.content ?? ""}
                            created_at={review.created_at}
                            updated_at={review.updated_at}
                            user_reaction={review.user_reaction}
                        />
                    ))
                )}
            </section>
        </>
    );
};

export default ProductComment;
