import { PaletteMode } from '@mui/material';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = { mode: PaletteMode };

const INITIAL_STORE: Store = { mode: 'dark' };

export const useThemeModeStore = create<Store>()(
  persist(() => INITIAL_STORE, { name: 'themeMode-storage' }),
);

export const setThemeMode = (newMode: PaletteMode) =>
  useThemeModeStore.setState({ mode: newMode });
