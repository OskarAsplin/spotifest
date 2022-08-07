import { ThemeOptions } from '@mui/material/styles';
import { pink, lightBlue } from '@mui/material/colors';

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
  background: {
    default: '#202020',
    paper: '#202020',
  },
};
