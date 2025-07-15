import { Parameters } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import i18n from '../src/translations/i18n';
import '../src/index.css';

export const parameters: Parameters = {
  backgrounds: { disable: true },
  docs: {
    canvas: {
      // override the canvas background based on the theme
      className: `!bg-background`,
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
  },
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
  }),
];
