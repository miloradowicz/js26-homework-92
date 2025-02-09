import { Inbound } from '../types';

export const isCreateMessage = (
  m: Inbound,
): m is {
  type: 'CREATE_MESSAGE';
  payload: {
    recepient?: string;
    message: string;
  };
} =>
  m.type === 'CREATE_MESSAGE' &&
  typeof m.payload === 'object' &&
  (typeof m.payload.recepient === 'string' || typeof m.payload.recepient === 'undefined') &&
  typeof m.payload.message === 'string';

export const isDeleteMessage = (m: Inbound): m is { type: 'DELETE_MESSAGE'; payload: string } =>
  m.type === 'DELETE_MESSAGE' && typeof m.payload === 'string';
