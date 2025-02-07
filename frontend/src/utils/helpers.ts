/* eslint-disable @typescript-eslint/no-explicit-any */

import { GenericError, Inbound, Message, TypedError } from '@/types';

export const isGenericError = (e: any): e is GenericError => 'error' in e && typeof e.error === 'string';

export const isTypedError = (e: any): e is TypedError =>
  'errors' in e && typeof e.errors === 'object' && typeof Object.values(e.errors) === 'string';

export const hasMessage = (e: any): e is { message: string } => 'message' in e && typeof e.message === 'string';

export const hasMessagePayload = (p: Inbound): p is Inbound & { payload: Message } =>
  p.type === 'MESSAGE_CREATED' && typeof p.payload === 'object';

export const hasIdPayload = (p: Inbound): p is Inbound & { payload: string } =>
  (p.type === 'MESSAGE_DELETED' || p.type === 'USER_CONNECTED' || p.type === 'USER_DISCONNECTED') &&
  typeof p.payload === 'string';

export const isPrivateMessage = (m: Message): m is Message & { recepient: string } =>
  'recepient' in m && typeof m.recepient === 'string';
