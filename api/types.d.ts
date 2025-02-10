import { WebSocket } from 'express-ws';

import { Fields as UserFields } from './models/User';
import { Fields as MessageFields } from './models/Message';

export type UserInfo = Omit<UserFields, 'password' | 'token'>;
type Message = Omit<MessageFields, 'sender' | 'recepient'> & {
  sender: UserInfo;
  recepient?: UserInfo;
};

export interface GenericError {
  type: 'SYNTAX_ERROR' | 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR';
  error: string;
}

export interface ConnectionCollection {
  [id: string]: { user: UserInfo; socket: WebSocket };
}

export interface Inbound {
  type: 'CREATE_MESSAGE' | 'DELETE_MESSAGE' | 'AUTHORIZATION';
  payload: { recepient?: string; message: string } | string;
}

interface Outbound {
  type: 'CONNECTION_ESTABLISHED' | 'MESSAGE_CREATED' | 'MESSAGE_DELETED' | 'USER_CONNECTED' | 'USER_DISCONNECTED';
  payload: { users: UserInfo[]; messages: Message[] } | Message | UserInfo | string;
}
