import { Link } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import UserMenu from './UserMenu';

const Header = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position='static'>
      <Toolbar component='nav' sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6' component={Link} color='white' sx={{ textDecoration: 'none' }} to='/'>
          Веб-сокет чат 1.0
        </Typography>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Box display='flex' gap={1}>
            <Button component={Link} variant='contained' color='info' to='/login'>
              Войти
            </Button>
            <Button component={Link} variant='contained' color='info' to='/register'>
              Зарегистрироваться
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
