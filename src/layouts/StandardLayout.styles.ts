import { ThemeOptions } from '@material-ui/core/styles';
import { pink, lightBlue } from '@material-ui/core/colors';

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
