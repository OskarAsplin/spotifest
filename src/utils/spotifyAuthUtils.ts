import {
  spotifyClientId,
  spotifyAuthRedirectUri,
  authScopes,
} from './spotifyAuth.constants';
import { TokenResponse } from './spotifyAuth.types';
import { resetAuthStore, setToken } from '@src/zustand/authStore';
import { setSpotifyToken } from '@src/api/spotifyApi';
import { generateCodeChallenge } from './codeChallengeUtils';

const generateLoginUrl = async (path?: string) => {
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  const redirectUri = `${spotifyAuthRedirectUri}${path ?? ''}`;

  const params = {
    response_type: 'code',
    client_id: spotifyClientId,
    scope: authScopes.join(','),
    code_challenge_method: 'S256',
    code_challenge: await generateCodeChallenge(),
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();

  return authUrl.toString();
};

const fetchSpotifyToken = async (
  code: string,
  codeVerifier: string,
  path?: string,
): Promise<TokenResponse> => {
  const url = 'https://accounts.spotify.com/api/token';
  const redirectUri = `${spotifyAuthRedirectUri}${path ?? ''}`;
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: spotifyClientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  const response = await fetch(url, payload);
  if (!response.ok) throw new Error(response.statusText);

  return await response.json();
};

const fetchNewTokenWithRefreshToken = async (
  refreshToken: string,
): Promise<TokenResponse> => {
  const url = 'https://accounts.spotify.com/api/token';

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: spotifyClientId,
    }),
  };
  const response = await fetch(url, payload);
  if (!response.ok) throw new Error(response.statusText);

  return await response.json();
};

/** Reset AuthStore and redirect user to Spotify login page */
export const redirectToSpotifyLogin = async () => {
  const href = window.location.href;
  const path = href.includes('/share') ? '/share' : undefined;

  resetAuthStore();
  window.location.href = await generateLoginUrl(path); // Redirects to Spotify login
};

/** If returning from Spotify login, use code from search params to request login token */
export const getSpotifyAccessTokenWithCode = async (
  code: string,
  codeVerifier: string,
) => {
  const href = window.location.href;
  const path = href.includes('/share') ? '/share' : undefined;

  const tokenResponse = await fetchSpotifyToken(code, codeVerifier, path);
  setSpotifyTokenInAuthStoreAndSpotifyApi(tokenResponse);
};

/** Use refresh token to get a new access token */
export const refreshSpotifyAccessToken = async (refreshToken: string) => {
  const tokenResponse = await fetchNewTokenWithRefreshToken(refreshToken);
  setSpotifyTokenInAuthStoreAndSpotifyApi(tokenResponse);
};

export const setSpotifyTokenInAuthStoreAndSpotifyApi = (
  tokenResponse: TokenResponse,
) => {
  const unixTimeNow = new Date().getTime(); // Unix time in milliseconds
  const unixExpiryTime = unixTimeNow + Number(tokenResponse.expires_in) * 1000;

  setToken({
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    unixExpiryTime,
  });
  setSpotifyToken(tokenResponse.access_token);
};
