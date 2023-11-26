import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  loggedIn: boolean;
}

export const useAuthStore = create<AuthStore, any>(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set) => ({
      loggedIn: true,
    }),
    { name: 'auth-storage' },
  ),
);

export const setLoggedIn = () => useAuthStore.setState({ loggedIn: true });
export const setLoggedOut = () => useAuthStore.setState({ loggedIn: false });
