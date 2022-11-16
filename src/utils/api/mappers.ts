import { getBigPicture, getIconPicture } from '../utils';

export const mapSpotifyArtistToArtistInfo = (
  response: SpotifyApi.SingleArtistResponse | SpotifyApi.ArtistObjectFull
) => ({
  artist: mapSpotifyArtistToArtist(response),
  festivalsFuture: [],
  festivalsPast: [],
});

export const mapSpotifyArtistToArtist = (
  response: SpotifyApi.SingleArtistResponse | SpotifyApi.ArtistObjectFull
) => ({
  name: response.name,
  spotifyId: response.id,
  iconPicture: getIconPicture(response.images),
  bigPicture: getBigPicture(response.images),
  popularity: response.popularity,
  genres: response.genres,
});
