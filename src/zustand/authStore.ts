import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = { loggedIn: boolean };

const INITIAL_STORE: Store = { loggedIn: true };

export const useAuthStore = create<Store, any>(
  persist((_set) => INITIAL_STORE, { name: 'auth-storage' }),
);

export const setLoggedIn = () => useAuthStore.setState({ loggedIn: true });
export const setLoggedOut = () => useAuthStore.setState({ loggedIn: false });
