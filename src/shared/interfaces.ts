
export interface IUser {
    id: string;
    name: string;
    photo: string;
    email: string;
    lastSeen: { seconds: string; nanoseconds: string }
}

export interface IChat {
    id: string;
    users: [string, string];
}

export interface IMessage {
    id: string;
    edited: boolean;
    message: string;
    photoURL: string;
    timestamp: { seconds: string; nanoseconds: string }
    user: string
}