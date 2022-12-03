import { CssBaseline, PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Story, StoryContext } from '@storybook/react';
import { getMainTheme } from '../src/theme/theme.styles';

export const withTheme = (story: Story, context: StoryContext) => {
  const mode: PaletteMode =
    context.globals.backgrounds?.value === '#FFF' ? 'light' : 'dark';
  return (
    <ThemeProvider theme={createTheme(getMainTheme(mode))}>
      <CssBaseline />
      {story(context)}
    </ThemeProvider>
  );
};
