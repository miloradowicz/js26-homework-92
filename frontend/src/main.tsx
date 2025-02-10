import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import '@fontsource/roboto/cyrillic.css';

import { persistor, store } from './app/store';
import { addAuthorization } from './api';
import App from './App.tsx';
import { blue } from '@mui/material/colors';

addAuthorization(store);

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: blue[200],
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              autoHideDuration={3000}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              maxSnack={1}
            >
              <CssBaseline />
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>,
);
