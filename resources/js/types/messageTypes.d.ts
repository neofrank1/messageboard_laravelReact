export type Message = {
    id: number;
    content: string;
    likes: number;
    dislikes: number;
    user_name: string;
    created_at: string;
    updated_at: string;
}

export interface MessageProps {
    messages: Message[];
}