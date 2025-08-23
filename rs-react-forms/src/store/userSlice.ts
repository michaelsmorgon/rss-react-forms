import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserFormData } from '../utils/types';

interface UsersState {
  list: UserFormData[];
}

const initialState: UsersState = {
  list: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser(
      state,
      action: PayloadAction<Omit<UserFormData, 'id' | 'createdAt'>>
    ) {
      const now = Date.now();
      state.list.unshift({
        ...action.payload,
        id: crypto.randomUUID()
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
        createdAt: now,
      });
    },
    clearUsers(state) {
      state.list = [];
    },
  },
});

export const { addUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;
