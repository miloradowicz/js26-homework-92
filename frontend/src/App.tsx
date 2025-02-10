import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';

import { useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/users/usersSlice';
import Header from '@/components/UI/Header/Header';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Chat from '@/features/chat/containers/Chat';
import SignIn from '@/features/users/containers/SignIn';
import SignUp from '@/features/users/containers/SignUp';
import Page404 from '@/components/Page404/Page404';

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Header />
      <Container maxWidth='lg' sx={{ py: 8, px: 2 }}>
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute isAllowed={!!user}>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
