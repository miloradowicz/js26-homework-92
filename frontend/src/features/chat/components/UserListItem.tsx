import { baseURL } from '@/constants';
import { UserInfo } from '@/types';
import { stringToColor } from '@/utils/helpers';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Paper, ListItemButton } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import { FC } from 'react';

interface Props {
  user: UserInfo;
  selected: boolean;
  onClick: () => void;
}

const UserListItem: FC<Props> = ({ user, selected, onClick: handleClick }) => {
  const isUrlRelative = (url: string) => new URL(document.baseURI).origin === new URL(url, document.baseURI).origin;

  return (
    <ListItem
      component={Paper}
      elevation={4}
      sx={{
        my: 1,
        borderRadius: 2,
        bgcolor: selected ? green[50] : blue[50],
      }}
      disablePadding
    >
      <ListItemButton onClick={handleClick}>
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
      </ListItemButton>
    </ListItem>
  );
};

export default UserListItem;
