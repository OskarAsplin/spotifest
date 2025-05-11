import PageNotFound from '@src/pages/PageNotFound';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import { useMemo } from 'react';
import { useThemeModeStore } from '@src/zustand/themeStore';
import { getMainTheme } from '@src/theme/theme.styles';
import ApiProvider from '@src/api/ApiProvider';

const App = () => {
  const themeMode = useThemeModeStore((state) => state.mode);
  const theme = useMemo(
    () => createTheme(getMainTheme(themeMode)),
    [themeMode],
  );

  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApiProvider>
            <Outlet />
          </ApiProvider>
        </ThemeProvider>
      </StyledEngineProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: App,
  notFoundComponent: PageNotFound,
});
