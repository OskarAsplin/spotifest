import {
  Palette as MuiPalette,
  PaletteOptions as MuiPaletteOptions,
} from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface Palette extends MuiPalette {
    tertiary?: {
      dark: string;
      main: string;
      light: string;
    };
  }
  interface PaletteOptions extends MuiPaletteOptions {
    tertiary?: {
      dark: string;
      main: string;
      light: string;
    };
  }
}
