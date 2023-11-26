import { setSpotifyToken } from './api/spotifyApi';
import { getAuthorizeHref } from './oauthConfig';
import { getHashParams, removeHashParamsFromUrl } from './utils/hashUtils';
import { logOut, setToken, useAuthStore } from './zustand/authStore';

const TEN_MINUTES = 600000; // In Milliseconds
const unixTimeNow = new Date().getTime(); // Unix time in milliseconds

const hashParams = getHashParams();
const freshToken = hashParams.access_token;
const expiresIn = hashParams.expires_in; // Seconds
const expiryTime = unixTimeNow + Number(expiresIn) * 1000;
const storedToken = useAuthStore.getState().accessToken;
const storedExpiryTime = useAuthStore.getState().expiryTime;

export const setupToken = () => {
  if (freshToken) {
    setToken({ accessToken: freshToken, expiryTime: String(expiryTime) });
    setSpotifyToken(freshToken);
    removeHashParamsFromUrl();
  } else if (storedToken) {
    setSpotifyToken(storedToken);
    if (storedExpiryTime) {
      const unixExpiryTime = Number(storedExpiryTime);
      if (unixTimeNow > unixExpiryTime) {
        logOut();
      } else if (unixTimeNow > unixExpiryTime - TEN_MINUTES) {
        // If less than 10 minutes until expiry time, get new access token
        window.open(getAuthorizeHref(), '_self');
      }
    }
  }
};
