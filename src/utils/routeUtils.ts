export const getArtistPath = (artistName: string, spotifyId?: string) =>
  `/artist/${getArtistParam(artistName, spotifyId)}`;

export const getArtistParam = (artistName: string, spotifyId?: string) => {
  if (spotifyId) return `spotifyId=${spotifyId}`;
  return encodeURIComponent(artistName);
};

export const getFestivalPath = (festivalName: string) =>
  '/festival/' + encodeURIComponent(festivalName);
