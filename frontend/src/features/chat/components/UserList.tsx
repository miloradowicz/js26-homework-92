import { UserInfo } from '@/types';
import { Box, List } from '@mui/material';
import { FC } from 'react';
import UserListItem from './UserListItem';
import { blue } from '@mui/material/colors';

interface Props {
  users: UserInfo[];
  selectedUser: UserInfo | null;
  onItemClick: (_: UserInfo) => void;
}

const UserList: FC<Props> = ({ users, selectedUser, onItemClick: handleClick }) => {
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
          flexDirection: 'column',
          justifyContent: 'stretch',
        }}
      >
        {users.map((x) => (
          <UserListItem key={x._id} user={x} selected={x._id === selectedUser?._id} onClick={() => handleClick(x)} />
        ))}
      </List>
    </Box>
  );
};

export default UserList;
