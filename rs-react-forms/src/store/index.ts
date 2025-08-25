import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import countriesReducer from './countrySlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    countries: countriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
