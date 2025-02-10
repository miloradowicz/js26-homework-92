import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Send } from '@mui/icons-material';
import { ChangeEventHandler, FC, useState } from 'react';

interface Props {
  onSend: (_: string) => Promise<void>;
}

const MessageForm: FC<Props> = ({ onSend }) => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setError(null);
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (!message) {
      return void setError('Message cannot be empty');
    }

    onSend(message);
  };

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, bgcolor: blue[100], borderRadius: 4 }}>
      <Box display='flex' flexDirection='column' gap={1}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Strat typing here...'
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleSend} disabled={!!error}>
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
