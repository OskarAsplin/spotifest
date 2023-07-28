import { PaletteMode } from '@mui/material';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PaletteModeStore {
  mode: PaletteMode;
  setMode: (newMode: PaletteMode) => void;
}

export const useThemeModeStore = create<PaletteModeStore, any>(
  persist(
    (set) => ({
      mode: 'dark',
      setMode: (newMode: PaletteMode) => set({ mode: newMode }),
    }),
    { name: 'themeMode-storage' },
  ),
);
