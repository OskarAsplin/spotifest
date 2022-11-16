import { getBigPicture, getIconPicture } from '../utils';
import { Artist, ArtistInfo, Playlist, UserInfo } from '../../redux/types';

export const mapSpotifyArtistToArtistInfo = (
  response: SpotifyApi.SingleArtistResponse | SpotifyApi.ArtistObjectFull
): ArtistInfo => ({
  artist: mapSpotifyArtistToArtist(response),
  festivalsFuture: [],
  festivalsPast: [],
});

export const mapSpotifyArtistToArtist = (
  response: SpotifyApi.SingleArtistResponse | SpotifyApi.ArtistObjectFull
): Artist => ({
  name: response.name,
  spotifyId: response.id,
  iconPicture: getIconPicture(response.images),
  bigPicture: getBigPicture(response.images),
  popularity: response.popularity,
  genres: response.genres,
});

export const mapToArtistWithPopularity = (
  artist: SpotifyApi.ArtistObjectFull,
  userPopularity: number
): Artist => ({
  name: artist.name,
  spotifyId: artist.id,
  iconPicture: getIconPicture(artist.images),
  bigPicture: getBigPicture(artist.images),
  popularity: artist.popularity,
  userPopularity: userPopularity,
  genres: artist.genres,
});

export const mapSpotifyPlaylistToPlaylist = (
  playlist: SpotifyApi.PlaylistObjectSimplified
): Playlist => ({
  name: playlist.name,
  id: playlist.id,
  images: playlist.images.map((image) => image.url),
  ownerId: playlist.owner.id,
  numTracks: playlist.tracks.total,
});

export const mapToUserInfo = (
  getMe: SpotifyApi.CurrentUsersProfileResponse
): UserInfo => ({
  country: getMe.country,
  displayName: getMe.display_name,
  profilePictureUrl: getMe.images
    ? getMe.images[0]
      ? getMe.images[0].url
      : undefined
    : undefined,
  spotifyUrl: getMe.external_urls.spotify,
  id: getMe.id,
});
