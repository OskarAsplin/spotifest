const authEndpoint = 'https://accounts.spotify.com/authorize';

const scopes = [
  'user-read-private',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
];

export const getAuthorizeHref = (path?: string): string => {
  const clientId = import.meta.env.VITE_SPOTIFEST_CLIENT_ID;
  const redirectUri = `${import.meta.env.VITE_REDIRECT_URI}${path ?? ''}`;
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    '%20',
  )}&response_type=token`;
};
