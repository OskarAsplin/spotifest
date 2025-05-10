import { Suspense, useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import AppBarContainer from '../containers/AppBarContainer';
import {
  useIsLoggedIn,
  useRefreshToken,
  useUnixExpiryTime,
} from '../zustand/authStore';
import { refreshSpotifyAccessToken } from '../utils/spotifyAuthUtils';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

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
      timeoutId = setTimeout(() => {
        refreshSpotifyAccessToken(refreshToken);
      }, timeLeftMs - FIVE_MINUTES_IN_MS);
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
