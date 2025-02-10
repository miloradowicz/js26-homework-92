import express from 'express';

import { ConnectionCollection, GenericError, Inbound, Outbound, UserInfo } from '../types';
import Message, { Fields as MessageFields } from '../models/Message';
import { isAuthorization, isCreateMessage, isDeleteMessage } from '../utils/classifiers';
import mongoose from 'mongoose';
import User from '../models/User';
import assert from 'assert';

const connections: ConnectionCollection = {};

const notify = (msg: Outbound, targets?: { roles?: string[]; ids: mongoose.Types.ObjectId[] }) => {
  let _connections = Object.entries(connections).map(([id, { user, socket }]) => ({ id, user, socket }));

  if (targets) {
    const _roles = targets.roles ?? ['moderator'];
    _connections = _connections.filter(
      (x) => _roles.includes(x.user.role) || targets.ids.map((x) => String(x)).includes(String(x.user._id)),
    );
  }

  for (const c of _connections) {
    c.socket.send(JSON.stringify(msg));
  }
};

const router = express.Router();

export const mount = () => {
  router.ws('/', async (ws) => {
    let user: UserInfo | null = null;

    ws.on('message', async (_inbound) => {
      try {
        const inbound = JSON.parse(_inbound.toString()) as Inbound;

        if (isAuthorization(inbound)) {
          if (!inbound.payload) {
            return void ws.close(
              3000,
              JSON.stringify({
                type: 'UNAUTHENTICATED',
                error: 'Authorization token is invalid',
              } as GenericError),
            );
          }

          const _user = await User.findOne({ token: inbound.payload }, { password: 0, token: 0 });

          if (!_user) {
            return void ws.close(
              3000,
              JSON.stringify({
                type: 'UNAUTHENTICATED',
                error: 'Authorization token is invalid',
              } as GenericError),
            );
          }

          user = _user;

          let messages: (Omit<MessageFields, 'sender' | 'recepient'> & { sender: UserInfo; recepient?: UserInfo })[];
          if (user.role === 'member') {
            messages = await Message.find({
              $or: [{ sender: user._id }, { recepient: user._id }, { recepient: null }],
            })
              .populate<{ sender: UserInfo }>('sender', { token: 0 })
              .populate<{ recepient?: UserInfo }>('recepient', { token: 0 });
          } else if (user.role === 'moderator') {
            messages = await Message.find({})
              .populate<{ sender: UserInfo }>('sender', { token: 0 })
              .populate<{ recepient?: UserInfo }>('recepient', { token: 0 });
          } else {
            return void ws.close(
              3000,
              JSON.stringify({
                type: 'UNAUTHORIZED',
                error: 'Only members and moderators are allowed',
              } as GenericError),
            );
          }
          notify({
            type: 'USER_CONNECTED',
            payload: user,
          } as Outbound);

          connections[String(user._id)] = { user, socket: ws };
          const users = Object.entries(connections).map(([_, { user }]) => user);
          return void ws.send(
            JSON.stringify({
              type: 'CONNECTION_ESTABLISHED',
              payload: { users: users, messages },
            } as Outbound),
          );
        }

        if (!user) {
          return void ws.close(
            3000,
            JSON.stringify({
              type: 'UNAUTHENTICATED',
              error: 'Only authenticated users are allowed',
            } as GenericError),
          );
        }

        if (isCreateMessage(inbound)) {
          const { _id } = await Message.create({
            sender: user._id,
            recepient: inbound.payload.recepient,
            message: inbound.payload.message,
          });

          const message = await Message.findById(_id)
            .populate<{ sender: UserInfo }>('sender', { password: 0, token: 0 })
            .populate<{ recepient?: UserInfo }>('recepient', { password: 0, token: 0 });

          assert(message);
          return void notify(
            {
              type: 'MESSAGE_CREATED',
              payload: message,
            } as Outbound,
            message.recepient ? { ids: [message.sender._id, message.recepient._id] } : undefined,
          );
        } else if (isDeleteMessage(inbound)) {
          if (user.role !== 'moderator')
            return void ws.send(
              JSON.stringify({
                type: 'UNAUTHORIZED',
                error: 'Only moderators can delete messages',
              } as GenericError),
            );

          const message = await Message.findByIdAndDelete(inbound.payload);

          if (!message) {
            return void ws.send(
              JSON.stringify({
                type: 'NOT_FOUND',
                error: 'Message not found',
              } as GenericError),
            );
          }

          return void notify(
            {
              type: 'MESSAGE_DELETED',
              payload: String(message._id),
            } as Outbound,
            message.recepient ? { ids: [message.sender, message.recepient] } : undefined,
          );
        } else {
          return void ws.send(
            JSON.stringify({
              type: 'SYNTAX_ERROR',
              error: 'Request not recognized',
            } as GenericError),
          );
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          return void ws.send(
            JSON.stringify({
              type: 'SYNTAX_ERROR',
              error: e.message,
            } as GenericError),
          );
        } else if (e instanceof Error) {
          return void ws.send(
            JSON.stringify({
              type: 'SERVER_ERROR',
              error: e.message,
            } as GenericError),
          );
        }

        console.error(e);
      }
    });

    ws.on('close', async () => {
      if (user) {
        delete connections[String(user._id)];

        notify({
          type: 'USER_DISCONNECTED',
          payload: String(user._id),
        } as Outbound);
      }
    });
  });
};

export default router;
