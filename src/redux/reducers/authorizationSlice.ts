import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthorizationState {
  loggedIn: boolean;
  accessToken: string;
  tokenExpiryDate: string;
}

const initialState: AuthorizationState = {
  loggedIn: false,
  accessToken: '',
  tokenExpiryDate: '',
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
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setTokenExpiryDate: (state, action: PayloadAction<number>) => {
      if (action.payload === 0) {
        state.tokenExpiryDate = '';
      } else {
        const date = new Date();
        date.setSeconds(date.getSeconds() + action.payload);
        state.tokenExpiryDate = date.toISOString();
      }
    },
  },
});

export const { setLoggedIn, setLoggedOff, setAccessToken, setTokenExpiryDate } =
  authorizationSlice.actions;

export const selectLoggedIn = (state: RootState) =>
  state.authorization.loggedIn;
export const selectAccessToken = (state: RootState) =>
  state.authorization.accessToken;
export const selectTokenExpiryDate = (state: RootState) =>
  state.authorization.tokenExpiryDate;

export default authorizationSlice.reducer;
