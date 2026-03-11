import { fetchWithAuth, fetchWithOptionAuth, getToken } from "@/handler/token_handler";
import { CommentProps, ReplyProps } from "@components/features/product/productComment";

export type NewReply = {
    content: string
} 

export type NewReview = {
    rating: number,
    content: string
} 

export type QueryReviews = {
    reviews: CommentProps[],
    page: number,
    has_more: boolean
}

export type QueryReplies = {
    replies: ReplyProps[],
    has_more: boolean
}

export const uploadReview = async ( 
    product_id:string,
    payload : NewReview
): Promise<CommentProps> => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/products/${product_id}/review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) throw new Error("Failed to upload review")

    return data;
}

export const uploadReply = async (
    product_id:string,
    review_id: string,
    payload: NewReply
): Promise<ReplyProps> => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/products/${product_id}/reviews/${review_id}/reply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) throw new Error("Failed to upload reply")

    return data;
}

export const reactReview = async (
    review_id: string,
    payload: {reaction: "like" | "dislike" | "none"}
) => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/products/review/${review_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    return;
}

export const queryReviews = async ( 
    product_id:string,
    page : number
): Promise<QueryReviews> => {
    const res = await fetchWithOptionAuth(`/api/v2/search/review/${product_id}?page=${page}`)
    const data = await res.json()

    if (!res.ok) throw new Error("Failed to fetch reviews")

    return data;
}

export const queryReplies = async ( 
    product_id:string,
    review_id:string,
    page : number
): Promise<QueryReplies> => {
    const res = await fetchWithOptionAuth(`/api/v2/search/review/${product_id}/review/${review_id}/replies?page=${page}`)
    const data = await res.json()

    if (!res.ok) throw new Error("Failed to fetch reviews")

    return data;
}

