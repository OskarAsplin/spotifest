import { Story, StoryContext } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getMainTheme } from '../src/theme/theme.styles';
import { CssBaseline, PaletteMode } from '@mui/material';

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
