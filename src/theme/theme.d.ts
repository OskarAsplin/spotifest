import {
  Palette as MuiPalette,
  PaletteOptions as MuiPaletteOptions,
} from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette extends MuiPalette {
    tertiary: Palette['primary'];
  }

  interface PaletteOptions extends MuiPaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}
