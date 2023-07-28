import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  loggedIn: boolean;
  setLoggedIn: () => void;
  setLoggedOut: () => void;
}

export const useAuthStore = create<AuthStore, any>(
  persist(
    (set) => ({
      loggedIn: true,
      setLoggedIn: () => set({ loggedIn: true }),
      setLoggedOut: () => set({ loggedIn: false }),
    }),
    { name: 'auth-storage' },
  ),
);
