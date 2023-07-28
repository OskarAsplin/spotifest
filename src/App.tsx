import { CssBaseline } from '@mui/material';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import { useMemo } from 'react';
import ApiProvider from './api/ApiProvider';
import './App.scss';
import { getMainTheme } from './theme/theme.styles';
import { Routes } from './Routes';
import { useThemeModeStore } from './zustand/themeStore';

const App = () => {
  const themeMode = useThemeModeStore((state) => state.mode);
  const theme = useMemo(
    () => createTheme(getMainTheme(themeMode)),
    [themeMode],
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApiProvider>
          <Routes />
        </ApiProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
