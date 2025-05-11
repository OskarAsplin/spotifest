import { Suspense, useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { CenteredLoadingSpinner } from '@src/components/atoms/LoadingSpinner/LoadingSpinner';
import { AppBarContainer } from '@src/containers/AppBarContainer';
import {
  useIsLoggedIn,
  useRefreshToken,
  useUnixExpiryTime,
} from '@src/zustand/authStore';
import { refreshSpotifyAccessToken } from '@src/utils/spotifyAuthUtils';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
const FIVE_SECONDS_IN_MS = 5 * 1000;

export const StandardLayout = ({
  hideIfNotLoggedIn,
}: {
  hideIfNotLoggedIn?: boolean;
}) => {
  const isLoggedIn = useIsLoggedIn();
  const refreshToken = useRefreshToken();
  const unixExpiryTime = useUnixExpiryTime();

  useEffect(() => {
    let timeoutId: number | undefined;
    if (refreshToken && unixExpiryTime) {
      const unixTimeNow = new Date().getTime(); // Unix time in milliseconds
      const timeLeftMs = unixExpiryTime - unixTimeNow;
      timeoutId = setTimeout(
        () => {
          refreshSpotifyAccessToken(refreshToken);
          // Fetch new token if it's less than 5 minutes until the old one expires.
          // Set a 5 seconds minimum timeout to not trigger double refresh logic,
          // since we also have a check in the `beforeLoad` of several routes
          // that are loaded inside the StandardLayout
        },
        Math.max(timeLeftMs - FIVE_MINUTES_IN_MS, FIVE_SECONDS_IN_MS),
      );
    }

    return () => clearTimeout(timeoutId);
  }, [refreshToken, unixExpiryTime]);

  if (hideIfNotLoggedIn && !isLoggedIn) return <Outlet />;

  return (
    <>
      <AppBarContainer />
      <Suspense fallback={<CenteredLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </>
  );
};
