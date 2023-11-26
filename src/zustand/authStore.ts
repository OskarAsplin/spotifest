import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = { accessToken?: string; expiryTime?: string };

const INITIAL_STORE: Store = {};

export const useAuthStore = create<Store>()(
  persist(() => INITIAL_STORE, { name: 'auth-storage' }),
);

export const useIsLoggedIn = () => useAuthStore((state) => !!state.accessToken);

export const setToken = ({
  accessToken,
  expiryTime,
}: {
  accessToken: string;
  expiryTime: string;
}) => useAuthStore.setState({ accessToken, expiryTime });

export const logOut = () => useAuthStore.setState(INITIAL_STORE, true);
