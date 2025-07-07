import { PageNotFound } from '@src/pages/PageNotFound';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';
import { useThemeMode } from '@src/zustand/themeStore';
import { ApiProvider } from '@src/api/ApiProvider';

const App = () => {
  const themeMode = useThemeMode();

  // Sync with HTML class for immediate theme application
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeMode);
  }, [themeMode]);

  return (
    <>
      <ApiProvider>
        <Outlet />
      </ApiProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  component: App,
  notFoundComponent: PageNotFound,
});
