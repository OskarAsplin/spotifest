import {
  NotFoundRoute,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  lazyRouteComponent,
} from '@tanstack/react-router';
import { StandardLayout } from './layouts/StandardLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import PageNotFound from './pages/PageNotFound';

const rootRoute = new RootRoute();

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: lazyRouteComponent(() => import('./pages/LoginPage')),
});
const withLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'withLayoutRoute',
  component: () => <StandardLayout />,
});
const withProtectedAndLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'withProtectedAndLayoutRoute',
  component: () => (
    <ProtectedRoute>
      <StandardLayout />
    </ProtectedRoute>
  ),
});
export const indexRoute = new Route({
  getParentRoute: () => withProtectedAndLayoutRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/MainPage')),
});
export const artistRoute = new Route({
  getParentRoute: () => withLayoutRoute,
  path: 'artist/$artistId',
  component: lazyRouteComponent(() => import('./pages/ArtistPage')),
});
export const festivalRoute = new Route({
  getParentRoute: () => withLayoutRoute,
  path: 'festival/$festivalId',
  component: lazyRouteComponent(() => import('./pages/FestivalPage')),
});
export const shareMatchesRoute = new Route({
  getParentRoute: () => withLayoutRoute,
  path: 'share/$matchBasis',
  component: lazyRouteComponent(() => import('./pages/SharedResultsPage')),
});
// When returning from Spotify login without matchBasis in path
export const shareMatchesReturnRoute = new Route({
  getParentRoute: () => withLayoutRoute,
  path: 'share',
  component: lazyRouteComponent(
    () => import('./pages/SharedResultsReturnPage'),
  ),
});
export const aboutRoute = new Route({
  getParentRoute: () => withLayoutRoute,
  path: 'about',
  component: lazyRouteComponent(() => import('./pages/AboutPage')),
});
const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: PageNotFound,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  withProtectedAndLayoutRoute.addChildren([indexRoute]),
  withLayoutRoute.addChildren([
    artistRoute,
    festivalRoute,
    shareMatchesRoute,
    shareMatchesReturnRoute,
    aboutRoute,
  ]),
]);

const router = new Router({ routeTree, notFoundRoute });

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Routes = () => <RouterProvider router={router} />;
