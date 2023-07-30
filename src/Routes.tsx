import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
} from '@tanstack/router';
import React from 'react';
import { StandardLayout } from './layouts/StandardLayout';
import WithSpotifyTokenRoute from './layouts/WithSpotifyTokenRoute';
import AboutPage from './pages/AboutPage';
import ArtistPage from './pages/ArtistPage';
import FestivalPage from './pages/FestivalPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import PageNotFound from './pages/PageNotFound';
import SharedResultsPage from './pages/SharedResultsPage';

const TanStackRouterDevtools =
  import.meta.env.VITE_ROUTER_DEVTOOLS === 'true'
    ? React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )
    : () => null;

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: () => <LoginPage />,
});
const withTokenAndLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'withTokenAndLayoutRoute',
  component: () => (
    <WithSpotifyTokenRoute>
      <StandardLayout />
    </WithSpotifyTokenRoute>
  ),
});
export const indexRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: '/',
  component: () => <MainPage />,
});
const artistRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'artist/$artistId',
  component: () => <ArtistPage />,
});
const festivalRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'festival/$festivalId',
  component: () => <FestivalPage />,
});
const shareRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'share',
  component: () => <SharedResultsPage />,
});
const shareMatchRoute = new Route({
  getParentRoute: () => shareRoute,
  path: '$matchBasis',
});
const aboutRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'about',
  component: () => <AboutPage />,
});
const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: () => <PageNotFound />,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  withTokenAndLayoutRoute.addChildren([
    indexRoute,
    artistRoute,
    festivalRoute,
    shareRoute.addChildren([shareMatchRoute]),
    aboutRoute,
  ]),
  notFoundRoute,
]);

const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/router' {
  interface Register {
    router: typeof router;
  }
}

export const Routes = () => <RouterProvider router={router} />;
