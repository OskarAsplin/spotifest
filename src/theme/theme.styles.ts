import { PaletteMode, ThemeOptions } from '@mui/material';
import { deepOrange, lightBlue, pink } from '@mui/material/colors';
import { PaletteOptions } from '@mui/material/styles';

const mainThemePaletteOptions: PaletteOptions = {
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
  tertiary: {
    light: deepOrange[300],
    main: deepOrange[500],
    dark: deepOrange[700],
  },
};

export const getMainTheme = (mode: PaletteMode): ThemeOptions => ({
  typography: {
    fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
  },
  palette: {
    ...mainThemePaletteOptions,
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
