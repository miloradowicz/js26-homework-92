import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Send } from '@mui/icons-material';
import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import { UserInfo } from '@/types';

interface Props {
  recepient: UserInfo | null;
  onSend: (_: string) => Promise<void>;
}

const MessageForm: FC<Props> = ({ recepient, onSend }) => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>();
  const [sending, setSending] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setError(null);
    setMessage(e.target.value);
  };

  const handleSend = useCallback(async () => {
    try {
      setSending(true);

      if (!message) {
        return void setError('Сообщение не должно быть пустым');
      }

      await onSend(message);
    } finally {
      setSending(false);
    }
  }, [message, onSend]);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, bgcolor: blue[100], borderRadius: 4 }}>
      <Box display='flex' flexDirection='column' gap={1}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder={
            !recepient ? 'Написать всем' : `Сказать на ушко ${recepient.displayName} (${recepient.username})`
          }
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleSend} disabled={!!error} loading={sending}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          error={!!error}
          helperText={error}
        />
      </Box>
    </Box>
  );
};

export default MessageForm;
