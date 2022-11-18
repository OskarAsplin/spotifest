import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthorizationState {
  loggedIn: boolean;
}

const initialState: AuthorizationState = {
  loggedIn: false,
};

export const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setLoggedIn: (state) => {
      state.loggedIn = true;
    },
    setLoggedOff: (state) => {
      state.loggedIn = false;
    },
  },
});

export const { setLoggedIn, setLoggedOff } = authorizationSlice.actions;

export const selectLoggedIn = (state: RootState) =>
  state.authorization.loggedIn;

export default authorizationSlice.reducer;
