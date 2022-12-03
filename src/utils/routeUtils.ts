export const isMainPage = (url: string) =>
  /spotifest\.app\/?$/.test(url) || /localhost:3000\/?$/.test(url);

export const getArtistPath = (artistName: string, spotifyId?: string) => {
  if (spotifyId) return `/artist/spotifyId=${spotifyId}`;
  return '/artist/' + encodeURIComponent(artistName);
};

export const getFestivalPath = (festivalName: string) =>
  '/festival/' + encodeURIComponent(festivalName);
