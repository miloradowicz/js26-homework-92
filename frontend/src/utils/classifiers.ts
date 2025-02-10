/* eslint-disable @typescript-eslint/no-explicit-any */

import { GenericError, Inbound, PopulatedMessage, TypedError, UserInfo } from '@/types';

export const isGenericError = (e: any): e is GenericError =>
  typeof e.error === 'string' &&
  (e.type === 'SYNTAX_ERROR' || e.type === 'UNAUTHENTICATED' || e.type === 'UNAUTHORIZED' || e.type === 'NOT_FOUND');

export const isTypedError = (e: any): e is TypedError =>
  typeof e.errors === 'object' &&
  typeof Object.keys(e.errors) === 'string' &&
  typeof Object.values(e.errors) === 'string';

export const hasMessage = (e: any): e is { message: string } => typeof e.message === 'string';

export const isConnectionEstablished = (
  m: Inbound,
): m is {
  type: 'CONNECTION_ESTABLISHED';
  payload: {
    users: UserInfo[];
    messages: PopulatedMessage[];
  };
} =>
  m.type === 'CONNECTION_ESTABLISHED' &&
  typeof m.payload === 'object' &&
  'users' in m.payload &&
  'messages' in m.payload &&
  Array.isArray(m.payload.users) &&
  Array.isArray(m.payload.messages);

export const isMessageCreated = (m: Inbound): m is { type: 'MESSAGE_CREATED'; payload: PopulatedMessage } =>
  m.type === 'MESSAGE_CREATED' &&
  typeof m.payload === 'object' &&
  'message' in m.payload &&
  typeof m.payload._id === 'string' &&
  typeof m.payload.sender === 'object' &&
  (typeof m.payload.recepient === 'object' || typeof m.payload === 'undefined') &&
  typeof m.payload.message === 'string';

export const isMessageDeleted = (m: Inbound): m is { type: 'MESSAGE_DELETED'; payload: string } =>
  m.type === 'MESSAGE_DELETED' && typeof m.payload === 'string';

export const isUserConnected = (m: Inbound): m is { type: 'USER_CONNECTED'; payload: UserInfo } =>
  m.type === 'USER_CONNECTED' &&
  typeof m.payload === 'object' &&
  'displayName' in m.payload &&
  typeof m.payload.displayName === 'string';

export const isUserDisconnected = (m: Inbound): m is { type: 'USER_DISCONNECTED'; payload: string } =>
  m.type === 'USER_DISCONNECTED' && typeof m.payload === 'string';

export const isPrivateMessage = (
  m: PopulatedMessage,
): m is Omit<PopulatedMessage, 'recepient'> & { recepient: UserInfo } => typeof m.recepient === 'object';
