import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'dark' | 'light';

type Store = { mode: ThemeMode };

const INITIAL_STORE: Store = { mode: 'dark' };

const useThemeModeStore = create<Store>()(
  persist(() => INITIAL_STORE, { name: 'themeMode-storage' }),
);

export const useThemeMode = () => useThemeModeStore((state) => state.mode);

export const setThemeMode = (newMode: ThemeMode) =>
  useThemeModeStore.setState({ mode: newMode });
