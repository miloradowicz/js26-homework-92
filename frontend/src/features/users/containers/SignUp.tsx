import { isAxiosError } from 'axios';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Button, Container, Grid2 as Grid, Link, TextField, Typography } from '@mui/material';
import { AddAPhoto } from '@mui/icons-material';

import { GenericError, TypedError } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectLoading, selectError, clearError } from '../usersSlice';
import { loginWithGoogle, register } from '../usersThunk';
import FileInput from '../../../components/UI/FileInput/FileInput';

interface FormData {
  username: string;
  displayName: string;
  password: string;
  avatar: File | '';
}

const initialData: FormData = {
  username: '',
  displayName: '',
  password: '',
  avatar: '',
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<FormData>(initialData);
  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);

  const getFieldError = (fieldName: string) => {
    try {
      return (error as TypedError)?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    dispatch(clearError(e.target.name));

    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(clearError(e.target.name));

    if (e.target.files) {
      const file = e.target.files[0];
      setData((data) => ({ ...data, [e.target.name]: file }));
    }
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register({ ...data, avatar: data.avatar !== '' ? data.avatar : null })).unwrap();
      navigate('/');
    } catch (e) {
      if (!(e as TypedError).errors && (e as GenericError).error) {
        enqueueSnackbar((e as GenericError).error, { variant: 'error' });
      } else if (isAxiosError(e) && e.response?.data.error) {
        return void enqueueSnackbar(`${e.message}: ${e.response.data.error}`, { variant: 'error' });
      } else if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      } else if (((e): e is { message: string } => 'message' in (e as { message: string }))(e)) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      setData((data) => ({ ...data, password: '' }));
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label='Username'
                name='username'
                autoComplete='username'
                value={data.username}
                onChange={handleChange}
                error={!!getFieldError('username')}
                helperText={getFieldError('username')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label='Password'
                name='password'
                type='password'
                autoComplete='new-password'
                value={data.password}
                onChange={handleChange}
                error={!!getFieldError('password')}
                helperText={getFieldError('password')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label='Display name'
                name='displayName'
                autoComplete='displayName'
                value={data.displayName}
                onChange={handleChange}
                error={!!getFieldError('displayName')}
                helperText={getFieldError('displayName')}
              />
            </Grid>
            <Grid size={12}>
              <FileInput
                fullWidth
                label='Avatar'
                name='avatar'
                buttonText='Upload'
                buttonProps={{
                  disableElevation: true,
                  variant: 'contained',
                  startIcon: <AddAPhoto />,
                  sx: { px: 5 },
                }}
                value={data.avatar}
                onChange={handleFileInputChange}
                error={!!getFieldError('avatar')}
                helperText={getFieldError('avatar')}
              />
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} loading={loading}>
            Sign Up
          </Button>
        </Box>
        <Grid container justifyContent='flex-end'>
          <Grid>
            <Link component={routerLink} variant='body2' to='/login'>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignUp;
