import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  lazy,
} from '@tanstack/router';
import React from 'react';
import { StandardLayout } from './layouts/StandardLayout';
import WithSpotifyTokenRoute from './layouts/WithSpotifyTokenRoute';

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
  component: lazy(() => import('./pages/LoginPage')),
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
  component: lazy(() => import('./pages/MainPage')),
});
const artistRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'artist/$artistId',
  component: lazy(() => import('./pages/ArtistPage')),
});
const festivalRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'festival/$festivalId',
  component: lazy(() => import('./pages/FestivalPage')),
});
const shareRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'share',
  component: lazy(() => import('./pages/SharedResultsPage')),
});
const shareMatchRoute = new Route({
  getParentRoute: () => shareRoute,
  path: '$matchBasis',
});
const aboutRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'about',
  component: lazy(() => import('./pages/AboutPage')),
});
const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: lazy(() => import('./pages/PageNotFound')),
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
