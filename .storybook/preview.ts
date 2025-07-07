import { Parameters } from '@storybook/react-vite';
import i18n from '../src/translations/i18n';

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

export const decorators = [];
