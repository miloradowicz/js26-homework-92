import { Box } from '@mui/material';
import MessageListItem from './MessageListItem';
import { PopulatedMessage } from '@/types';
import { FC, useCallback } from 'react';
import { blue } from '@mui/material/colors';

interface Props {
  messages: PopulatedMessage[];
  onItemDelete: (_: string) => Promise<void>;
}

const MessageList: FC<Props> = ({ messages, onItemDelete }) => {
  const handleDelete = useCallback(
    async (id: string) => {
      await onItemDelete(id);
    },
    [onItemDelete],
  );

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, bgcolor: blue[100], borderRadius: 4 }}>
      <Box display='flex' flexDirection='column' gap={1}>
        {messages.map((x) => (
          <MessageListItem
            key={x._id}
            message={x}
            onDelete={async () => {
              await handleDelete(x._id);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MessageList;
