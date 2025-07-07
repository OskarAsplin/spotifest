import { createFileRoute } from '@tanstack/react-router';
import { SharedResultsPage } from '@src/pages/SharedResultsPage';
import { getIsLoggedIn, getRefreshToken } from '@src/zustand/authStore';
import {
  redirectToSpotifyLogin,
  refreshSpotifyAccessToken,
} from '@src/utils/spotifyAuthUtils';
import { setSharedMatchBasis } from '@src/zustand/sharedResultsStore';

export const Route = createFileRoute('/_withProtectedLayout/share/$matchBasis')(
  {
    component: SharedResultsPage,
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
  },
);
