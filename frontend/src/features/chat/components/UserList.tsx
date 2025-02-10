import { UserInfo } from '@/types';
import { Box, List } from '@mui/material';
import { FC } from 'react';
import UserListItem from './UserListItem';
import { blue } from '@mui/material/colors';

interface Props {
  users: UserInfo[];
}

const UserList: FC<Props> = ({ users }) => {
  return (
    <Box
      sx={{
        overflowY: 'auto',
        py: 1,
        px: 2,
        bgcolor: blue[100],
        borderRadius: 4,
      }}
    >
      <List
        sx={{
          display: 'flex',
          gap: 1,
          sm: { flexDirection: 'row', justifyContent: 'stretch' },
          md: { flexDirection: 'column', alignItems: 'stretch' },
        }}
      >
        {users.map((x) => (
          <UserListItem key={x._id} user={x} />
        ))}
      </List>
    </Box>
  );
};

export default UserList;
