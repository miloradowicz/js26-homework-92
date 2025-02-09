import express from 'express';

import { ConnectionCollection, GenericError, Inbound, Outbound } from '../types';
import { RequestWithUser } from '../middleware/auth';
import Message from '../models/Message';
import { isCreateMessage, isDeleteMessage } from '../utils/classifiers';
import mongoose from 'mongoose';

const connections: ConnectionCollection = {};

const notify = (msg: Outbound, targets?: { roles?: string[]; ids: mongoose.Types.ObjectId[] }) => {
  let _connections = Object.entries(connections).map(([id, { user, socket }]) => ({ id, user, socket }));

  if (targets) {
    const _roles = targets.roles ?? ['moderator'];
    _connections = _connections.filter(
      (x) => _roles.includes(x.user.role) || targets.ids.map((x) => String(x)).includes(x.id),
    );
  }

  for (const c of _connections) {
    c.socket.send(JSON.stringify(msg));
  }
};

const router = express.Router();

export const mount = () => {
  router.ws('/', async (ws, req) => {
    const user = (req as RequestWithUser).user;

    if (!user) {
      ws.send(
        JSON.stringify({
          type: 'UNAUTHENTICATED',
          error: 'Only authenticated users are allowed',
        } as GenericError),
      );
      return void ws.close();
    }

    let messages: ReturnType<typeof Message.hydrate>[];
    if (user.role === 'member') {
      messages = await Message.find({ $or: [{ sender: user._id }, { recepient: user._id }, { recepient: null }] });
    } else if (user.role === 'moderator') {
      messages = await Message.find({});
    } else {
      ws.send(
        JSON.stringify({
          type: 'UNAUTHORIZED',
          error: 'Only members and moderators are allowed',
        } as GenericError),
      );
      return void ws.close();
    }

    connections[String(user._id)] = { user, socket: ws };

    ws.send(
      JSON.stringify({
        type: 'CONNECTION_ESTABLISHED',
        payload: messages,
      } as Outbound),
    );

    notify({ type: 'USER_CONNECTED', payload: String(user._id) } as Outbound);

    ws.on('message', async (_msg) => {
      try {
        const msg = JSON.parse(_msg.toString()) as Inbound;

        if (isCreateMessage(msg)) {
          const message = await Message.create({
            sender: user._id,
            recepient: msg.payload.recepient,
            message: msg.payload.message,
          });

          notify(
            {
              type: 'MESSAGE_CREATED',
              payload: message,
            } as Outbound,
            message.recepient ? { ids: [message.sender, message.recepient] } : undefined,
          );
        } else if (isDeleteMessage(msg)) {
          if (user.role !== 'moderator')
            return void ws.send(
              JSON.stringify({
                type: 'UNAUTHORIZED',
                error: 'Only moderators can delete messages',
              } as GenericError),
            );

          const message = await Message.findByIdAndDelete(msg.payload);

          if (!message) {
            return void ws.send(
              JSON.stringify({
                type: 'NOT_FOUND',
                error: 'Message not found',
              } as GenericError),
            );
          }

          notify(
            {
              type: 'MESSAGE_DELETED',
              payload: String(message._id),
            } as Outbound,
            message.recepient ? { ids: [message.sender, message.recepient] } : undefined,
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
      delete connections[String(user._id)];

      notify({
        type: 'USER_DISCONNECTED',
        payload: String(user._id),
      } as Outbound);
    });
  });
};

export default router;
