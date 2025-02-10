import { useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/users/usersSlice';
import { PopulatedMessage } from '@/types';
import { Box, Paper, Typography } from '@mui/material';
import { blue, grey, yellow } from '@mui/material/colors';
import { FC } from 'react';

interface Props {
  message: PopulatedMessage;
}

const MessageListItem: FC<Props> = ({ message }) => {
  const user = useAppSelector(selectUser);

  return (
    <>
      {user && (
        <Box
          display='flex'
          flexDirection='column'
          alignItems={message.sender._id === user._id ? 'flex-end' : 'flex-start'}
        >
          <Paper
            elevation={4}
            sx={{
              py: 1,
              px: 2,
              my: 1,
              maxWidth: '70%',
              borderRadius: 2,
              bgcolor: message.recepient ? yellow[50] : blue[50],
              textAlign: message.sender._id !== user._id ? 'left' : 'right',
            }}
          >
            <Typography display='block' variant='caption' sx={{ color: grey[500] }}>
              {`${message.sender.displayName} (${message.sender.username})`}
            </Typography>
            {message.recepient && (
              <Typography variant='caption' sx={{ color: grey[500] }} fontStyle='italic'>
                шепотом @{`${message.recepient.displayName} (${message.recepient.username})`}
              </Typography>
            )}
            <Typography>{message.message}</Typography>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default MessageListItem;
