export interface GenericError {
  error: string;
}

export interface TypedError {
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: 'user' | 'moderator';
  token: string;
}

export interface Session {
  message: string;
  user: User | null;
}

export interface SignInMutation {
  username: string;
  password: string;
}

export interface SignUpMutation {
  username: string;
  password: string;
  displayName: string;
  avatar: File | null;
}

interface Message {
  _id: string;
  sender: string;
  recepient?: string;
  message: string;
}

type MessageMutation = Omit<Message, '_id' | 'sender'>;

interface Inbound {
  type: 'MESSAGE_CREATED' | 'MESSAGE_DELETED' | 'USER_CONNECTED' | 'USER_DISCONNECTED';
  payload: Message | string;
}

interface Outbound {
  type: 'INITIATE_CONNECTION' | 'CREATE_MESSAGE' | 'DELETE_MESSAGE';
  payload: MessageMutation | string;
}
