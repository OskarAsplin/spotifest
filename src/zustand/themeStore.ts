import { PaletteMode } from '@mui/material';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PaletteModeStore {
  mode: PaletteMode;
}

export const useThemeModeStore = create<PaletteModeStore, any>(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set) => ({
      mode: 'dark',
    }),
    { name: 'themeMode-storage' },
  ),
);

export const setThemeMode = (newMode: PaletteMode) =>
  useThemeModeStore.setState({ mode: newMode });
