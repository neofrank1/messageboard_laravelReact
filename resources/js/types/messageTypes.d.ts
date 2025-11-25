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

export interface NewMessage {
    content: string;
    receiver_id: number;
}

export interface Friends {
    id: number;
    value: string;
}