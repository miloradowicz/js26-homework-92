import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const Page404 = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h1'>404</Typography>
      <Typography variant='h6' gutterBottom>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant='contained' component={Link} to='/'>
        Back Home
      </Button>
    </Box>
  );
};

export default Page404;
