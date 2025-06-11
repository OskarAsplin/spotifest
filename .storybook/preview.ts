import { Parameters } from '@storybook/react-vite';
import i18n from '../src/translations/i18n';

import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { getMainTheme } from '../src/theme/theme.styles';

export const parameters: Parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
  },
};

const lightTheme = createTheme(getMainTheme('light'));
const darkTheme = createTheme(getMainTheme('dark'));

export const decorators = [
  withThemeFromJSXProvider({
    GlobalStyles: CssBaseline,
    Provider: ThemeProvider,
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
    defaultTheme: 'dark',
  }),
];
