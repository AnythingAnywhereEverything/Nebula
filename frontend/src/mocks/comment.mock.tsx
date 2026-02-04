import { Comment } from "src/types/comment"

export const CommentMockUp: Comment[] = [
    {
        comment_id: "C1",
        user_id: "U1",
        username: "john",
        rating: 5,
        profile_image: "https://placehold.co/200",
    
        comment_text: "So good la",

        create_at: new Date(2026, 2 ,3),
        update_at: new Date(2026, 2 ,3),
        has_like : 1,
        response: []
    },
    {
        comment_id: "C2",
        user_id: "U1",
        username: "jane",
        rating: 3,
        profile_image: "https://placehold.co/200",
        
        comment_text: "ADSMOASMOIISAFIfasifjiafhifahfasiusfahuifshuiafs \n asdasdplsapdlsapdls",

        create_at: new Date(2026, 1 ,5),
        update_at: new Date(2026, 2 ,6),
        has_like: 0,
        response: [
            {
            subcomment_id: "SC1",
            user_id: "U100",
            username: "Po",
            proflie_image: "https://placehold.co/200",
            create_at: new Date(2026, 2 ,1),
            update_at: new Date(2026, 2 ,2),
            comment: "Ok"
        },
        {
            subcomment_id: "SC2",
            user_id: "U101",
            username: "Uni",
            proflie_image: "https://placehold.co/200",
            create_at: new Date(2026, 2 ,1),
            update_at: new Date(2026, 2 , 5),
            comment: "asdasdasdasdsadasdsadadsasd"
        }
    
    ]
    }
]