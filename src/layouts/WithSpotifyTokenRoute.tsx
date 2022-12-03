import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { setLoggedOff } from '../redux/reducers/authorizationSlice';
import { setSpotifyToken } from '../api/spotifyApi';
import { withFallback } from '../api/api';
import { getHashParams, removeHashParamsFromUrl } from '../utils/hashUtils';
import { getAuthorizeHref } from '../oauthConfig';
import {
  getStoredAccessToken,
  getStoredExpiryTime,
  removeStoredAccessToken,
  removeStoredExpiryTime,
  setStoredAccessToken,
  setStoredExpiryTime,
} from '../utils/localStorageUtils';

const TEN_MINUTES = 600000; // In Milliseconds
const ONE_DAY = 86400000; // In Milliseconds

const hashParams = getHashParams();
const freshToken = hashParams.access_token;
const expiresIn = hashParams.expires_in;
const actualExpiryTime = expiresIn ? expiresIn + ONE_DAY : expiresIn; // Spotify is returning the current time...
const storedToken = getStoredAccessToken();
const storedExpiryTime = getStoredExpiryTime();

if (freshToken) {
  setStoredAccessToken(freshToken);
  setStoredExpiryTime(actualExpiryTime);
  setSpotifyToken(freshToken);
  removeHashParamsFromUrl();
} else if (storedToken) {
  setSpotifyToken(storedToken);
}

const WithSpotifyTokenRoute = withFallback()(() => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (storedToken) {
      if (storedExpiryTime) {
        const unixTimeNow = new Date().getTime();
        const unixTimeExpiry = Date.parse(storedExpiryTime);
        if (unixTimeNow > unixTimeExpiry) {
          dispatch(setLoggedOff());
        } else if (unixTimeNow > unixTimeExpiry - TEN_MINUTES) {
          // If less than 10 minutes until expiry time, get new access token
          removeStoredAccessToken();
          removeStoredExpiryTime();
          window.open(getAuthorizeHref(), '_self');
        }
      }
    } else if (!freshToken) dispatch(setLoggedOff());
  }, []);

  return <Outlet />;
});

export default WithSpotifyTokenRoute;
