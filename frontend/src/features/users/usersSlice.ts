import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TypedError, User } from '../../types';
import { RootState } from '../../app/store';
import { login, register, logout } from './usersThunk';

interface State {
  user: User | null;
  loading: boolean;
  error: TypedError | null;
}

const initialState: State = {
  user: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state, { payload }: PayloadAction<string>) => {
      const _error = state.error as TypedError;
      if (_error?.errors[payload]) {
        delete _error.errors[payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? null;
      })
      .addCase(logout.pending, (state) => {
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const users = slice.reducer;
export const { clearUser, clearError } = slice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoading = (state: RootState) => state.users.loading;
export const selectError = (state: RootState) => state.users.error;
