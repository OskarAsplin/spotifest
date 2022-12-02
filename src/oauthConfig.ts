const authEndpoint = 'https://accounts.spotify.com/authorize';

const scopes = [
  'user-read-private',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
];

export const getAuthorizeHref = (path?: string): string => {
  const clientId = process.env.REACT_APP_SPOTIFEST_CLIENT_ID;
  const redirectUri = `${process.env.REACT_APP_REDIRECT_URI}${path}`;
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    '%20'
  )}&response_type=token`;
};
