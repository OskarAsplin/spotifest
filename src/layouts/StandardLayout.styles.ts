import { ThemeOptions } from '@mui/material/styles';
import { pink, lightBlue } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';

export const lightBluePinkThemeOptions: ThemeOptions['palette'] = {
  primary: {
    light: lightBlue[300],
    main: lightBlue[500],
    dark: lightBlue[700],
  },
  secondary: {
    light: pink[300],
    main: pink[400],
    dark: pink[700],
  },
};

export const getMainTheme = (mode: PaletteMode) => ({
  typography: {
    fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
  },
  palette: {
    ...lightBluePinkThemeOptions,
    mode,
    ...(mode === 'dark'
      ? {
          background: {
            default: '#202020',
            paper: '#202020',
          },
        }
      : {}),
  },
});
