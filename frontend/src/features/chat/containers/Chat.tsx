import { Grid2 as Grid, Typography } from '@mui/material';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';
import { Outbound, PopulatedMessage, UserInfo } from '@/types';
import { wsURL } from '@/constants';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack';
import {
  isConnectionEstablished,
  isGenericError,
  isMessageCreated,
  isMessageDeleted,
  isUserConnected,
  isUserDisconnected,
} from '@/utils/classifiers';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearUser, selectUser } from '@/features/users/usersSlice';
import Loader from '@/components/UI/Loader/Loader';
import { grey } from '@mui/material/colors';

const Chat = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [users, setUsers] = useState<UserInfo[]>([]);
  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [recepient, setRecepient] = useState<UserInfo | null>(null);

  const ws = useRef<WebSocket | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const connect = useCallback(() => {
    ws.current = new WebSocket(wsURL);

    ws.current.onopen = function () {
      this.send(JSON.stringify({ type: 'AUTHORIZATION', payload: user?.token } as Outbound));
    };

    ws.current.onmessage = (e) => {
      try {
        const inbound = JSON.parse(e.data);

        if (isGenericError(inbound)) {
          throw new Error(inbound.error);
        }

        if (isConnectionEstablished(inbound)) {
          enqueueSnackbar('Подключение установлено', { variant: 'success' });
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
          throw new Error('Нераспознанный ответ от сервера');
        }
      } catch (e) {
        if (e instanceof Error) {
          return void enqueueSnackbar(e.message, { variant: 'error' });
        }

        console.error(e);
      }
    };

    ws.current.onclose = (e) => {
      if (e.code === 3000) {
        dispatch(clearUser());
      } else if (e.code === 1002 || e.code === 1006 || e.code === 1008) {
        setLoading(true);
        enqueueSnackbar('Подключение прервано, переподключаем...', { variant: 'error' });

        setTimeout(connect, 5000);
      }
    };
  }, [enqueueSnackbar, user, dispatch]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const handleSend = useCallback(
    async (message: string) => {
      if (ws.current) {
        ws.current.send(
          JSON.stringify({
            type: 'CREATE_MESSAGE',
            payload: { message, ...(recepient ? { recepient: recepient._id } : {}) },
          } as Outbound),
        );
      }
    },
    [recepient],
  );

  const handleItemDelete = useCallback(async (id: string) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: 'DELETE_MESSAGE', payload: id } as Outbound));
    }
  }, []);

  const handleItemClick = useCallback(
    async (u: UserInfo) => {
      if (u._id === user?._id) {
        setRecepient(null);
      } else if (u._id === recepient?._id) {
        setRecepient((recepient) => (!recepient ? u : null));
      } else {
        setRecepient(u);
      }
    },
    [recepient, user],
  );

  return (
    <>
      <Loader open={loading} />
      <Grid container spacing={1}>
        <Grid size={{ sm: 12, md: 4 }}>
          <Typography component='h3' variant='h5' px={2}>
            Подлюченные пользователи:
          </Typography>
          <Typography variant='caption' fontStyle='italic' px={2}>
            Нажмите на пользователя, чтобы сказать на ушко
          </Typography>
          <UserList users={users} selectedUser={recepient} onItemClick={handleItemClick} />
        </Grid>
        <Grid size={{ sm: 12, md: 8 }}>
          <Grid container direction='column' spacing={1}>
            <Typography component='h3' variant='h5' px={2}>
              Сообщения:
            </Typography>
            <Grid>
              <MessageList messages={messages} onItemDelete={handleItemDelete} />
            </Grid>
            <Grid>
              <Typography component='h3' variant='h6' px={2}>
                Новое сообщение:
              </Typography>
              {recepient && (
                <Typography variant='caption' sx={{ color: grey[500] }} fontStyle='italic'>
                  шепотом @{`${recepient.displayName} (${recepient.username})`}
                </Typography>
              )}
              <MessageForm recepient={recepient} onSend={handleSend} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
