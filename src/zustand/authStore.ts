import { create } from 'zustand';

interface AuthStore {
  loggedIn: boolean;
  setLoggedIn: () => void;
  setLoggedOut: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loggedIn: true,
  setLoggedIn: () => set({ loggedIn: true }),
  setLoggedOut: () => set({ loggedIn: false }),
}));
