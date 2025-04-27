import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isValidToken } from './authStore.utils';

type Store = {
  accessToken?: string;
  refreshToken?: string;
  unixExpiryTime?: number;
  codeVerifier?: string;
};

const INITIAL_STORE: Store = {};

export const useAuthStore = create<Store>()(
  persist(() => INITIAL_STORE, { name: 'spotify-auth-storage' }),
);

const isLoggedIn = (state: Store) =>
  !!state.accessToken && isValidToken(state.unixExpiryTime);
export const useIsLoggedIn = () => useAuthStore(isLoggedIn);
export const useUnixExpiryTime = () =>
  useAuthStore((state) => state.unixExpiryTime);
export const useRefreshToken = () =>
  useAuthStore((state) => state.refreshToken);

export const getIsLoggedIn = () => isLoggedIn(useAuthStore.getState());
export const getCodeVerifier = () => useAuthStore.getState().codeVerifier;
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const getRefreshToken = () => useAuthStore.getState().refreshToken;

export const setCodeVerifier = (codeVerifier: string) =>
  useAuthStore.setState({ codeVerifier });

export const setToken = ({
  accessToken,
  refreshToken,
  unixExpiryTime,
}: {
  accessToken: string;
  refreshToken?: string;
  unixExpiryTime: number;
}) =>
  useAuthStore.setState((state) => ({
    accessToken,
    refreshToken: refreshToken ?? state.refreshToken,
    unixExpiryTime,
  }));

export const resetAuthStore = () => useAuthStore.setState(INITIAL_STORE, true);
