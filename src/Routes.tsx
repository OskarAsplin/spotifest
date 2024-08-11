import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  RouterProvider,
} from '@tanstack/react-router';
import ProtectedRoute from './layouts/ProtectedRoute';
import { StandardLayout } from './layouts/StandardLayout';
import PageNotFound from './pages/PageNotFound';

const rootRoute = createRootRoute({ notFoundComponent: PageNotFound });

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: lazyRouteComponent(() => import('./pages/LoginPage')),
});
const withLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'withLayoutRoute',
  component: () => <StandardLayout />,
});
const withProtectedAndLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'withProtectedAndLayoutRoute',
  component: () => (
    <ProtectedRoute>
      <StandardLayout />
    </ProtectedRoute>
  ),
});
export const indexRoute = createRoute({
  getParentRoute: () => withProtectedAndLayoutRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/MainPage')),
});
export const artistRoute = createRoute({
  getParentRoute: () => withLayoutRoute,
  path: 'artist/$artistId',
  component: lazyRouteComponent(() => import('./pages/ArtistPage')),
});
export const festivalRoute = createRoute({
  getParentRoute: () => withLayoutRoute,
  path: 'festival/$festivalId',
  component: lazyRouteComponent(() => import('./pages/FestivalPage')),
});
export const shareMatchesRoute = createRoute({
  getParentRoute: () => withLayoutRoute,
  path: 'share/$matchBasis',
  component: lazyRouteComponent(() => import('./pages/SharedResultsPage')),
});
// When returning from Spotify login without matchBasis in path
export const shareMatchesReturnRoute = createRoute({
  getParentRoute: () => withLayoutRoute,
  path: 'share',
  component: lazyRouteComponent(
    () => import('./pages/SharedResultsReturnPage'),
  ),
});
export const aboutRoute = createRoute({
  getParentRoute: () => withLayoutRoute,
  path: 'about',
  component: lazyRouteComponent(() => import('./pages/AboutPage')),
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

const router = createRouter({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Routes = () => <RouterProvider router={router} />;
