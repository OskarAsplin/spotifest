import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  lazyRouteComponent,
} from '@tanstack/react-router';
import React from 'react';
import { StandardLayout } from './layouts/StandardLayout';
import WithSpotifyTokenRoute from './layouts/WithSpotifyTokenRoute';
import ProtectedRoute from './layouts/ProtectedRoute';

const TanStackRouterDevtools =
  import.meta.env.DEV && import.meta.env.VITE_ROUTER_DEVTOOLS === 'true'
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
  component: lazyRouteComponent(() => import('./pages/LoginPage')),
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
const withProtectedTokenAndLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'withProtectedTokenAndLayoutRoute',
  component: () => (
    <WithSpotifyTokenRoute>
      <ProtectedRoute>
        <StandardLayout />
      </ProtectedRoute>
    </WithSpotifyTokenRoute>
  ),
});
export const indexRoute = new Route({
  getParentRoute: () => withProtectedTokenAndLayoutRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/MainPage')),
});
export const artistRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'artist/$artistId',
  component: lazyRouteComponent(() => import('./pages/ArtistPage')),
});
export const festivalRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'festival/$festivalId',
  component: lazyRouteComponent(() => import('./pages/FestivalPage')),
});
export const shareRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'share',
  component: lazyRouteComponent(() => import('./pages/SharedResultsPage')),
});
export const shareMatchRoute = new Route({
  getParentRoute: () => shareRoute,
  path: '$matchBasis',
});
export const aboutRoute = new Route({
  getParentRoute: () => withTokenAndLayoutRoute,
  path: 'about',
  component: lazyRouteComponent(() => import('./pages/AboutPage')),
});
const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: lazyRouteComponent(() => import('./pages/PageNotFound')),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  withProtectedTokenAndLayoutRoute.addChildren([indexRoute]),
  withTokenAndLayoutRoute.addChildren([
    artistRoute,
    festivalRoute,
    shareRoute.addChildren([shareMatchRoute]),
    aboutRoute,
  ]),
  notFoundRoute,
]);

const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Routes = () => <RouterProvider router={router} />;
