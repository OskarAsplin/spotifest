import { PaletteMode } from '@mui/material';
import { create } from 'zustand';

interface PaletteModeStore {
  mode: PaletteMode;
  setMode: (newMode: PaletteMode) => void;
}

export const useThemeModeStore = create<PaletteModeStore>((set) => ({
  mode: 'dark',
  setMode: (newMode: PaletteMode) => set({ mode: newMode }),
}));
