export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'light', value: '#FFF' },
      { name: 'dark', value: '#202020' },
    ],
  },
  viewMode: 'docs',
};
