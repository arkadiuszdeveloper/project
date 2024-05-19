type SignUpData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
}

type Credentials = {
    username: string;
    password: string;
}

type VerifyEmail = { email: string; key: string }
type VerifyEmailForm = VerifyEmail

type TAuthComponentMode = 'signIn' | 'signUp' | 'email' | 'recovery';

type CreateRoom = {
    relatedIds: number[];
    readonly: boolean;
}
type CreateRoomForm = CreateRoom

type THomeMode = 'friends' | 'groups';

type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    publicKey: string;
    createDateTime: Date;
    lastLoginDateTime: Date;
    lastActiveDateTime: Date;
    accessToken: string;
    avatarBase64: string;
    emailVerification: boolean;
}

type TRoom = {
    id: number;
    name: string;
    relatedIds: number[];
    adminIds: number[];
    createDateTime: Date;  
    lastActiveDateTime: Date;
    lastMessage: TMessage;
    readonly: boolean;
    avatarBase64: string;
}

type TMessage = { 
    id: number;
    roomId: number;
    ownerId: number;
    viewedIds: number[];
    createDateTime: Date;
    lastEditDateTime: Date;
    replied_to_message_id: number;
} & (
    | {
        crypted: true;
        payload: string;
    }
    | {
        crypted: false;
        payload: TMessagePayload;
    }
)

type TMessagePayload = 
    | {
        type: 'text';
        message: string;
    }
    | {
        type: 'vote';
        votes: number[]
    }

type TChatLayout = 'default' | 'allLeft'

type TPreview = {
    title: string;
    description: string;
    image: string;
}