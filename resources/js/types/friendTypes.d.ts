export type FriendRequestTypes = {
    id: number;
    user_id: number;
    friend_id: number;
    status: boolean;
    user_name: string;
    user_email: string;
}

export type searchUserTypes = {
    id: number;
    name: string;
    email: string;
}

export type FriendListTypes = {
    id: number;
    user_id: number;
    friend_name: string;
    friend_email: string;
}