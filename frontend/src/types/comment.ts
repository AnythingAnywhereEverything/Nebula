export interface Comment {
    comment_id: string,
    user_id: string,
    username:string,
    rating: number,
    profile_image: string,

    comment_text?: string,

    create_at: Date,
    update_at: Date,
    has_like : number
    response: CommentResponse[]
}
export interface CommentResponse{
    subcomment_id: string,

    user_id: string,
    username:string,
    proflie_image: string
    create_at: Date,
    update_at: Date,
    comment: string,
}