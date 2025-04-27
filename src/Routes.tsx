import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
  RouterProvider,
} from '@tanstack/react-router';
import { StandardLayout } from './layouts/StandardLayout';
import PageNotFound from './pages/PageNotFound';
import {
  getCodeVerifier,
  getRefreshToken,
  getIsLoggedIn,
  resetAuthStore,
} from './zustand/authStore';
import {
  getSpotifyAccessTokenWithCode,
  redirectToSpotifyLogin,
  refreshSpotifyAccessToken,
} from './utils/spotifyAuthUtils';
import {
  getSharedMatchBasis,
  setSharedMatchBasis,
} from './zustand/sharedResultsStore';
import ErrorFallback from './layouts/ErrorFallback';
import { t } from 'i18next';
import { resetMathingStore } from './zustand/matchingStore';

const rootRoute = createRootRoute({ notFoundComponent: PageNotFound });

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: lazyRouteComponent(() => import('./pages/LoginPage')),
  beforeLoad: () => {
    resetAuthStore();
    resetMathingStore();
  },
});
const withLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'withLayoutRoute',
  component: () => <StandardLayout />,
});
const withProtectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'withProtectedLayoutRoute',
  component: () => <StandardLayout hideIfNotLoggedIn />,
});
export const indexRoute = createRoute({
  getParentRoute: () => withProtectedLayoutRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/MainPage')),
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: search.code as string | undefined,
  }),
  beforeLoad: async ({ search: { code } }) => {
    if (getIsLoggedIn()) return;

    const codeVerifier = getCodeVerifier();
    if (code && codeVerifier) {
      try {
        await getSpotifyAccessTokenWithCode(code, codeVerifier);
      } catch {
        throw redirect({ to: '/login' });
      }
      throw redirect({ to: '/' }); // To remove the code from URL params
    }

    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await refreshSpotifyAccessToken(refreshToken);

        return;
      } catch {
        throw redirect({ to: '/login' });
      }
    }

    throw redirect({ to: '/login' });
  },
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
  getParentRoute: () => withProtectedLayoutRoute,
  path: 'share/$matchBasis',
  component: lazyRouteComponent(() => import('./pages/SharedResultsPage')),
  beforeLoad: async ({ params: { matchBasis } }) => {
    if (getIsLoggedIn()) return;

    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await refreshSpotifyAccessToken(refreshToken);

        return;
      } catch {
        setSharedMatchBasis(matchBasis);
        redirectToSpotifyLogin();

        return;
      }
    }

    setSharedMatchBasis(matchBasis);
    redirectToSpotifyLogin();
  },
});
// When returning from Spotify login without matchBasis in path
export const shareMatchesReturnRoute = createRoute({
  getParentRoute: () => withProtectedLayoutRoute,
  path: 'share',
  component: () => (
    <ErrorFallback fallbackText={t('error.invalid_share_url')} />
  ),
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: search.code as string | undefined,
  }),
  beforeLoad: async ({ search: { code } }) => {
    const sharedMatchBasis = getSharedMatchBasis();
    const codeVerifier = getCodeVerifier();

    if (!code || !codeVerifier || !sharedMatchBasis) {
      throw Error('Invalid URL');
    }

    await getSpotifyAccessTokenWithCode(code, codeVerifier);
    throw redirect({
      to: '/share/$matchBasis',
      params: { matchBasis: sharedMatchBasis },
    });
  },
});
export const aboutRoute = createRoute({
  getParentRoute: () => withLayoutRoute,
  path: 'about',
  component: lazyRouteComponent(() => import('./pages/AboutPage')),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  withProtectedLayoutRoute.addChildren([
    indexRoute,
    shareMatchesRoute,
    shareMatchesReturnRoute,
  ]),
  withLayoutRoute.addChildren([artistRoute, festivalRoute, aboutRoute]),
]);

const router = createRouter({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Routes = () => <RouterProvider router={router} />;
