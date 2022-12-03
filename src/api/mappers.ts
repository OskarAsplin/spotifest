import { getBigPicture, getIconPicture } from '../utils/utils';
import {
  Artist,
  ArtistInfo,
  ArtistMinimal,
  MinimalUserInfo,
  Playlist,
  UserInfo,
} from '../redux/types';

export const mapToArtistInfo = (
  response: SpotifyApi.SingleArtistResponse | SpotifyApi.ArtistObjectFull
): ArtistInfo => ({
  artist: mapToArtist(response),
  festivalsFuture: [],
  festivalsPast: [],
});

export const mapToArtist = (
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

export const mapToArtistMinimal = (artist: Artist): ArtistMinimal => ({
  spotifyId: artist.spotifyId,
  userPopularity: artist.userPopularity,
});

export const mapToPlaylist = (
  playlist: SpotifyApi.PlaylistObjectSimplified
): Playlist => ({
  name: playlist.name,
  id: playlist.id,
  images: playlist.images.map((image) => image.url),
  ownerId: playlist.owner.id,
  numTracks: playlist.tracks.total,
  spotifyUrl: playlist.external_urls.spotify,
  isPublic: playlist.public,
});

export const mapToUserInfo = (
  user: SpotifyApi.CurrentUsersProfileResponse
): UserInfo => ({
  country: user.country,
  displayName: user.display_name,
  profilePictureUrl: user.images
    ? user.images[0]
      ? user.images[0].url
      : undefined
    : undefined,
  spotifyUrl: user.external_urls.spotify,
  id: user.id,
});

export const mapToMinimalUserInfo = (
  user: SpotifyApi.UserProfileResponse
): MinimalUserInfo => ({
  displayName: user.display_name,
  profilePictureUrl: user.images
    ? user.images[0]
      ? user.images[0].url
      : undefined
    : undefined,
  spotifyUrl: user.external_urls.spotify,
  id: user.id,
});
