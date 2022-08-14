import { ThemeOptions } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { deepOrange, indigo, pink, lightBlue } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';

const typography: TypographyOptions = {
  fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
};

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

export const getMainTheme = (mode: PaletteMode): ThemeOptions => ({
  typography,
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

export const indigoOrangePalette: ThemeOptions['palette'] = {
  primary: {
    light: indigo[300],
    main: indigo[500],
    dark: indigo[700],
  },
  secondary: {
    light: deepOrange[300],
    main: deepOrange[500],
    dark: deepOrange[700],
  },
};
