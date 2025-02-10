import { baseURL } from '@/constants';
import { UserInfo } from '@/types';
import { stringToColor } from '@/utils/helpers';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Paper } from '@mui/material';
import { blue } from '@mui/material/colors';
import { FC } from 'react';

interface Props {
  user: UserInfo;
}

const UserListItem: FC<Props> = ({ user }) => {
  const isUrlRelative = (url: string) => new URL(document.baseURI).origin === new URL(url, document.baseURI).origin;

  return (
    <ListItem
      component={Paper}
      elevation={4}
      sx={{
        py: 1,
        px: 2,
        my: 1,
        borderRadius: 2,
        bgcolor: blue[50],
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={user.displayName}
          sx={{ bgcolor: stringToColor(user.displayName), width: 32, height: 32 }}
          {...(user.avatarUrl
            ? {
                src: isUrlRelative(user.avatarUrl)
                  ? new URL(user.avatarUrl as string, new URL('images/', baseURL)).href
                  : user.avatarUrl,
              }
            : {
                children: user.displayName
                  .split(' ')
                  .map((x) => x.charAt(0))
                  .join(''),
              })}
        />
      </ListItemAvatar>
      <ListItemText primary={user.displayName} secondary={`${user.username} [${user.role}]`} />
    </ListItem>
  );
};

export default UserListItem;
