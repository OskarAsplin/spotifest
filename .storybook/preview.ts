import { Parameters } from '@storybook/react';
import { withTheme } from './decorators';
import i18n from '../src/translations/i18n';

export const parameters: Parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'light', value: '#FFF' },
      { name: 'dark', value: '#202020' },
    ],
  },
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
  },
};

export const decorators = [withTheme];
