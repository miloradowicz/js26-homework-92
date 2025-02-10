import { Grid2 as Grid } from '@mui/material';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';
import { Outbound, PopulatedMessage, UserInfo } from '@/types';
import { wsURL } from '@/constants';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  isConnectionEstablished,
  isGenericError,
  isMessageCreated,
  isMessageDeleted,
  isUserConnected,
  isUserDisconnected,
} from '@/utils/classifiers';
import { useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/users/usersSlice';
import Loader from '@/components/UI/Loader/Loader';

const Chat = () => {
  const user = useAppSelector(selectUser);

  const [users, setUsers] = useState<UserInfo[]>([]);
  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const ws = useRef<WebSocket | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const connect = useCallback(() => {
    ws.current = new WebSocket(wsURL);

    ws.current.onopen = function () {
      enqueueSnackbar('Connection established', { variant: 'success' });

      this.send(JSON.stringify({ type: 'AUTHORIZATION', payload: user?.token } as Outbound));
    };

    ws.current.onmessage = (e) => {
      try {
        const inbound = JSON.parse(e.data);

        if (isGenericError(inbound)) {
          throw new Error(inbound.error);
        }

        if (isConnectionEstablished(inbound)) {
          setUsers(inbound.payload.users);
          setMessages(inbound.payload.messages);
          setLoading(false);
        } else if (isMessageCreated(inbound)) {
          setMessages((messages) => [...messages, inbound.payload]);
        } else if (isMessageDeleted(inbound)) {
          setMessages((messages) => messages.filter((x) => x._id !== inbound.payload));
        } else if (isUserConnected(inbound)) {
          setUsers((users) => Array.from(new Set([...users, inbound.payload])));
        } else if (isUserDisconnected(inbound)) {
          setUsers((users) => users.filter((x) => x._id !== inbound.payload));
        } else {
          throw new Error('Response not recognized');
        }
      } catch (e) {
        if (e instanceof Error) {
          return void enqueueSnackbar(e.message, { variant: 'error' });
        }

        console.error(e);
      }
    };

    ws.current.onclose = (e) => {
      if (e.code === 1002 || e.code === 1006 || e.code === 1008) {
        enqueueSnackbar('Connection lost, trying to reconnect...', { variant: 'error' });

        setTimeout(connect, 5000);
      }
    };
  }, [enqueueSnackbar]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const handleSend = async (message: string) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: 'CREATE_MESSAGE', payload: { message } } as Outbound));
    }
  };

  const handleItemDelete = async (id: string) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: 'DELETE_MESSAGE', payload: id } as Outbound));
    }
  };

  return (
    <>
      <Loader open={loading} />
      <Grid container spacing={1}>
        <Grid size={{ sm: 12, md: 4 }}>
          <UserList users={users} />
        </Grid>
        <Grid size={{ sm: 12, md: 8 }}>
          <Grid container direction='column' spacing={1}>
            <Grid>
              <MessageList messages={messages} onItemDelete={handleItemDelete} />
            </Grid>
            <Grid>
              <MessageForm onSend={handleSend} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
