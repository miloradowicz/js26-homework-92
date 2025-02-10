import axios from 'axios';

import { baseURL } from './constants';
import { Store } from '@reduxjs/toolkit';
import { RootState } from './app/store';

export const api = axios.create({ baseURL });

export const addAuthorization = (store: Store<RootState>) => {
  api.interceptors.request.use((config) => {
    const token = store.getState().users.user?.token;

    config.headers.set('Authorization', token);

    return config;
  });
};
