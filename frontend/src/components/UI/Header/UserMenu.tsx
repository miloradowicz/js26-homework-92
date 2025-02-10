import { FC, MouseEventHandler, useRef, useState } from 'react';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';

import { User } from '../../../types';
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunk';
import { baseURL } from '../../../constants';
import { stringToColor } from '@/utils/helpers';

interface Props {
  user: User;
}

const UserMenu: FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const isUrlRelative = (url: string) => new URL(document.baseURI).origin === new URL(url, document.baseURI).origin;

  const handleClick: MouseEventHandler = async () => {
    setOpen(false);
    await dispatch(logout());
  };

  return (
    <>
      <Button
        color='inherit'
        ref={ref}
        endIcon={
          <Avatar
            alt={user.displayName}
            sx={{ bgcolor: stringToColor(user.displayName), width: 48, height: 48 }}
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
        }
        onClick={() => setOpen(true)}
      >
        {user.displayName}
      </Button>
      <Menu anchorEl={ref.current} open={open} onClose={() => setOpen(false)}>
        <MenuItem onClick={handleClick}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
