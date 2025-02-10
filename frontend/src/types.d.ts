export interface GenericError {
  type: 'SYNTAX_ERROR' | 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR';
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
  role: 'member' | 'moderator';
  token: string;
}

export type UserInfo = Omit<User, 'token'>;

export type SignInMutation = Omit<User, '_id' | 'displayName' | 'avatarUrl' | 'role' | 'token'> & {
  password: string;
};

export type SignUpMutation = Omit<User, '_id' | 'avatarUrl' | 'role' | 'token'> & {
  password: string;
  avatar: File | null;
};

export interface Message {
  _id: string;
  sender: string;
  recepient?: string;
  message: string;
}

type MessageMutation = Omit<Message, '_id' | 'sender'>;
type PopulatedMessage = Omit<Message, 'sender' | 'recepient'> & {
  sender: UserInfo;
  recepient?: UserInfo;
};

export interface Session {
  message: string;
  user: User | null;
}

interface Inbound {
  type: 'CONNECTION_ESTABLISHED' | 'MESSAGE_CREATED' | 'MESSAGE_DELETED' | 'USER_CONNECTED' | 'USER_DISCONNECTED';
  payload: { users: UserInfo[]; messages: PopulatedMessage[] } | PopulatedMessage | UserInfo | string;
}

interface Outbound {
  type: 'CREATE_MESSAGE' | 'DELETE_MESSAGE' | 'AUTHORIZATION';
  payload: MessageMutation | string;
}
