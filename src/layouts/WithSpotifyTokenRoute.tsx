import { useEffect } from 'react';
import { withFallback } from '../api/api';
import { setSpotifyToken } from '../api/spotifyApi';
import { getAuthorizeHref } from '../oauthConfig';
import { getHashParams, removeHashParamsFromUrl } from '../utils/hashUtils';
import {
  getStoredAccessToken,
  getStoredExpiryTime,
  removeStoredAccessToken,
  removeStoredExpiryTime,
  setStoredAccessToken,
  setStoredExpiryTime,
} from '../utils/localStorageUtils';
import { useAuthStore } from '../zustand/authStore';

const TEN_MINUTES = 600000; // In Milliseconds
const unixTimeNow = new Date().getTime(); // Unix time in milliseconds

const hashParams = getHashParams();
const freshToken = hashParams.access_token;
const expiresIn = hashParams.expires_in; // Seconds
const expiryTime = unixTimeNow + Number(expiresIn) * 1000;
const storedToken = getStoredAccessToken();

if (freshToken) {
  setStoredAccessToken(freshToken);
  setStoredExpiryTime(String(expiryTime));
  setSpotifyToken(freshToken);
  removeHashParamsFromUrl();
} else if (storedToken) {
  setSpotifyToken(storedToken);
}

interface Props {
  children: React.ReactNode;
}

const WithSpotifyTokenRoute = withFallback<Props>()(({ children }) => {
  const setLoggedOut = useAuthStore((state) => state.setLoggedOut);

  useEffect(() => {
    if (getStoredAccessToken()) {
      const storedExpiryTime = getStoredExpiryTime();
      if (storedExpiryTime) {
        const unixTimeExpiry = Number(storedExpiryTime);
        if (unixTimeNow > unixTimeExpiry) {
          setLoggedOut();
        } else if (unixTimeNow > unixTimeExpiry - TEN_MINUTES) {
          // If less than 10 minutes until expiry time, get new access token
          removeStoredAccessToken();
          removeStoredExpiryTime();
          window.open(getAuthorizeHref(), '_self');
        }
      }
    } else if (!freshToken) setLoggedOut();
  }, []);

  return <>{children}</>;
});

export default WithSpotifyTokenRoute;
