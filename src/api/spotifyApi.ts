import SpotifyWebApi from 'spotify-web-api-js';
import {
  mapToArtist,
  mapToArtistInfo,
  mapToArtistWithPopularity,
  mapToMinimalUserInfo,
  mapToPlaylist,
  mapToUserInfo,
} from './mappers';
import { Artist, MatchOption, Playlist } from './types';

const spotifyApi = new SpotifyWebApi();

const throwError = (error: any) => {
  throw error;
};

export const setSpotifyToken = (token: string) =>
  spotifyApi.setAccessToken(token);

export const getLoggedInUserInfo = () =>
  spotifyApi.getMe().then(mapToUserInfo, throwError);

export const getUserInfo = ({ userId }: { userId: string }) =>
  spotifyApi.getUser(userId).then(mapToMinimalUserInfo, throwError);

export const getArtistInfo = ({ spotifyId }: { spotifyId: string }) =>
  spotifyApi.getArtist(spotifyId).then(mapToArtistInfo, throwError);

export const getArtistRelatedArtists = ({ spotifyId }: { spotifyId: string }) =>
  spotifyApi
    .getArtistRelatedArtists(spotifyId)
    .then((response) => response.artists.map(mapToArtist), throwError);

export const getPlaylist = ({ id }: { id: string }) =>
  spotifyApi.getPlaylist(id).then(mapToPlaylist, throwError);

const LIMIT_PLAYLISTS = 50;

export const getAllPlaylists = ({
  userId,
  offset = 0,
  allPlaylists = [],
}: {
  userId: string;
  offset?: number;
  allPlaylists?: Playlist[];
}): Promise<Playlist[]> =>
  spotifyApi
    .getUserPlaylists(userId, { limit: LIMIT_PLAYLISTS, offset: offset })
    .then((userPlaylists) => {
      const playlistsWithTracks: Playlist[] = userPlaylists.items
        .filter((playlist) => playlist.tracks.total > 0)
        .map(mapToPlaylist);

      const updatedAllPlaylists = allPlaylists.concat(playlistsWithTracks);
      if (userPlaylists.total > offset + LIMIT_PLAYLISTS) {
        return getAllPlaylists({
          userId,
          offset: offset + LIMIT_PLAYLISTS,
          allPlaylists: updatedAllPlaylists,
        });
      } else
        return updatedAllPlaylists.sort((a, b) => a.name.localeCompare(b.name));
    }, throwError);

const LIMIT_ARTISTS = 50;

export const getTopArtistsWithPopularity = ({
  timeRange,
}: {
  timeRange: 'long_term' | 'medium_term' | 'short_term';
}) =>
  spotifyApi
    .getMyTopArtists({ limit: LIMIT_ARTISTS, time_range: timeRange })
    .then((response) => {
      return response.items.map((artist, idx) =>
        mapToArtistWithPopularity(artist, response.items.length * 2 - idx),
      );
    }, throwError);

const topArtistsCount = (numArtists: number) =>
  (numArtists * (3 * numArtists + 1)) / 2; // n(3n+1)/2

export const getAllTopArtistsWithPopularity = (): Promise<MatchOption> =>
  Promise.all([
    getTopArtistsWithPopularity({ timeRange: 'long_term' }),
    getTopArtistsWithPopularity({ timeRange: 'medium_term' }),
    getTopArtistsWithPopularity({ timeRange: 'short_term' }),
  ]).then(([topLongTerm, topMediumTerm, topShortTerm]) => {
    const countTopArtists =
      topArtistsCount(topLongTerm.length) +
      topArtistsCount(topMediumTerm.length) +
      topArtistsCount(topShortTerm.length);

    const tempDict: { [id: string]: Artist } = {};
    [...topLongTerm, ...topMediumTerm, ...topShortTerm].forEach((artist) => {
      if (artist.spotifyId! in tempDict) {
        tempDict[artist.spotifyId!].userPopularity! += artist.userPopularity!;
      } else {
        tempDict[artist.spotifyId!] = artist;
      }
    });

    return { artists: Object.values(tempDict), weight: countTopArtists };
  });

export const getAllArtists = ({
  artistIds,
  count,
  offset = 0,
  allArtists = [],
}: {
  artistIds: string[];
  count: { [id: string]: number };
  offset?: number;
  allArtists?: Artist[];
}): Promise<Artist[]> =>
  spotifyApi
    .getArtists(artistIds.slice(offset, offset + LIMIT_ARTISTS))
    .then((response) => {
      const newArtists = response.artists
        .filter(Boolean) // Spotify returns null for podcast "artists"
        .map((artist) => mapToArtistWithPopularity(artist, count[artist.id]));

      const updatedAllArtists = allArtists.concat(newArtists);

      if (offset + LIMIT_ARTISTS < artistIds.length) {
        return getAllArtists({
          artistIds,
          count,
          offset: offset + LIMIT_ARTISTS,
          allArtists: updatedAllArtists,
        });
      } else return updatedAllArtists;
    }, throwError);

const LIMIT_PLAYLIST_TRACKS = 100;

export const getAllArtistIdsFromPlaylist = ({
  id,
  offset = 0,
  allArtistIds = [],
}: {
  id: string;
  offset?: number;
  allArtistIds?: string[];
}): Promise<string[]> =>
  spotifyApi.getPlaylistTracks(id, { offset }).then((tracks) => {
    const newArtistIds: string[] = tracks.items
      // Can also contain podcast episodes, so these need to be filtered out
      .filter((trackItem) => Object.hasOwn(trackItem.track, 'artists'))
      .flatMap((trackItem) =>
        (trackItem.track as SpotifyApi.TrackObjectFull).artists.map(
          (trackArtist) => trackArtist.id,
        ),
      );

    const updatedAllArtistIds = allArtistIds.concat(newArtistIds);

    if (offset + LIMIT_PLAYLIST_TRACKS < tracks.total) {
      return getAllArtistIdsFromPlaylist({
        id,
        offset: offset + LIMIT_PLAYLIST_TRACKS,
        allArtistIds: updatedAllArtistIds,
      });
    } else return updatedAllArtistIds;
  }, throwError);

const LIMIT_SAVED_TRACKS = 50;

export const getAllArtistIdsFromSavedTracks = ({
  offset = 0,
  allArtistIds = [],
}: {
  offset?: number;
  allArtistIds?: string[];
} = {}): Promise<string[]> =>
  spotifyApi
    .getMySavedTracks({ offset, limit: LIMIT_SAVED_TRACKS })
    .then((tracks) => {
      const newArtistIds: string[] = tracks.items.flatMap((trackItem) =>
        trackItem.track.artists.map((trackArtist) => trackArtist.id),
      );

      const updatedAllArtistIds = allArtistIds.concat(newArtistIds);

      if (offset + LIMIT_SAVED_TRACKS < tracks.total) {
        return getAllArtistIdsFromSavedTracks({
          offset: offset + LIMIT_SAVED_TRACKS,
          allArtistIds: updatedAllArtistIds,
        });
      } else return updatedAllArtistIds;
    }, throwError);

export const getArtistsFromArtistIds = async (allArtistIdsRaw: string[]) => {
  const count: { [id: string]: number } = {};
  allArtistIdsRaw.forEach(
    (val: string) => (count[val] = (count[val] || 0) + 1),
  );
  const artistIds = [...new Set(allArtistIdsRaw)].filter(Boolean);
  const newArtists = await getAllArtists({ artistIds, count });

  return { artists: newArtists, weight: allArtistIdsRaw.length };
};

export const getAllPlaylistArtists = ({
  id,
}: {
  id: string;
}): Promise<MatchOption> =>
  getAllArtistIdsFromPlaylist({ id }).then(getArtistsFromArtistIds, throwError);

export const getAllArtistsFromSavedTracks = (): Promise<MatchOption> =>
  getAllArtistIdsFromSavedTracks().then(getArtistsFromArtistIds, throwError);

export const getOneSavedTrack = () => spotifyApi.getMySavedTracks({ limit: 1 });
