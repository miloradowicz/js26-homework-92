import { Box } from '@mui/material';
import MessageListItem from './MessageListItem';
import { PopulatedMessage } from '@/types';
import { FC } from 'react';
import { blue } from '@mui/material/colors';

interface Props {
  messages: PopulatedMessage[];
}

const MessageList: FC<Props> = ({ messages }) => {
  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, bgcolor: blue[100], borderRadius: 4 }}>
      <Box display='flex' flexDirection='column' gap={1}>
        {messages.map((x) => (
          <MessageListItem key={x._id} message={x} />
        ))}
      </Box>
    </Box>
  );
};

export default MessageList;
