import { WebSocket } from 'express-ws';

import { Fields as User } from './models/User';
import { Fields as Message } from './models/Message';

export interface GenericError {
  type: 'SYNTAX_ERROR' | 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR';
  error: string;
}

export interface ConnectionCollection {
  [id: string]: { user: User; socket: WebSocket };
}

export interface Inbound {
  type: 'CREATE_MESSAGE' | 'DELETE_MESSAGE';
  payload: { recepient?: string; message: string } | string;
}

interface Outbound {
  type: 'CONNECTION_ESTABLISHED' | 'MESSAGE_CREATED' | 'MESSAGE_DELETED' | 'USER_CONNECTED' | 'USER_DISCONNECTED';
  payload: Message[] | Message | string;
}
