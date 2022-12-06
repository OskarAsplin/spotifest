import { withTheme } from './decorators';
import i18n from '../src/translations/i18n';

export const parameters = {
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
  viewMode: 'docs',
  previewTabs: {
    'storybook/docs/panel': { index: -1 },
  },
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
  },
};

export const decorators = [withTheme];
