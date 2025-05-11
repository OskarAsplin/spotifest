import MainPage from '@src/pages/MainPage';
import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  getCodeVerifier,
  getIsLoggedIn,
  getRefreshToken,
} from '@src/zustand/authStore';
import {
  getSpotifyAccessTokenWithCode,
  refreshSpotifyAccessToken,
} from '@src/utils/spotifyAuthUtils';

export const Route = createFileRoute('/_withProtectedLayout/')({
  component: MainPage,
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
