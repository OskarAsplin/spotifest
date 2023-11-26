import SpotifyWebApi from 'spotify-web-api-js';
import {
  mapToArtist,
  mapToArtistInfo,
  mapToArtistWithPopularity,
  mapToMinimalUserInfo,
  mapToPlaylist,
  mapToUserInfo,
} from './mappers';
import {
  Artist,
  ArtistInfo,
  MinimalUserInfo,
  Playlist,
  UserInfo,
} from './types';

const spotifyApi = new SpotifyWebApi();

const throwError = (error: any) => {
  throw error;
};

export const setSpotifyToken = (token: string) =>
  spotifyApi.setAccessToken(token);

export async function getLoggedInUserInfo(): Promise<UserInfo> {
  return await spotifyApi.getMe().then(mapToUserInfo, throwError);
}

export async function getUserInfo({
  userId,
}: {
  userId: string;
}): Promise<MinimalUserInfo> {
  return await spotifyApi
    .getUser(userId)
    .then(mapToMinimalUserInfo, throwError);
}

export async function getArtistInfo({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<ArtistInfo> {
  return await spotifyApi
    .getArtist(spotifyId)
    .then(mapToArtistInfo, throwError);
}

export async function getArtistRelatedArtists({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<Artist[]> {
  return await spotifyApi
    .getArtistRelatedArtists(spotifyId)
    .then((response) => response.artists.map(mapToArtist), throwError);
}

export async function getPlaylist({
  id,
}: {
  id?: string;
}): Promise<Playlist | undefined> {
  if (!id) return undefined;
  return await spotifyApi.getPlaylist(id).then(mapToPlaylist, throwError);
}

export async function getAllPlaylists({
  userId,
  offset = 0,
  allPlaylists = [],
}: {
  userId: string;
  offset?: number;
  allPlaylists?: Playlist[];
}): Promise<Playlist[]> {
  return await spotifyApi
    .getUserPlaylists(userId, { limit: 50, offset: offset })
    .then((userPlaylists) => {
      const playlistsWithTracks: Playlist[] = userPlaylists.items
        .filter((playlist) => playlist.tracks.total > 0)
        .map(mapToPlaylist);

      const updatedAllPlaylists = allPlaylists.concat(playlistsWithTracks);
      if (userPlaylists.total > offset + 50) {
        return getAllPlaylists({
          userId,
          offset: offset + 50,
          allPlaylists: updatedAllPlaylists,
        });
      } else
        return updatedAllPlaylists.sort((a, b) => a.name.localeCompare(b.name));
    }, throwError);
}

async function getTopArtistsWithPopularity({
  timeRange,
}: {
  timeRange: 'long_term' | 'medium_term' | 'short_term';
}): Promise<Artist[]> {
  return await spotifyApi
    .getMyTopArtists({
      limit: 50,
      time_range: timeRange,
    })
    .then((response) => {
      return response.items.map((artist, idx) =>
        mapToArtistWithPopularity(artist, response.items.length * 2 - idx),
      );
    }, throwError);
}

const topArtistsCount = (numArtists: number) =>
  (numArtists * (3 * numArtists + 1)) / 2; // n(3n+1)/2

export async function getAllTopArtistsWithPopularity(): Promise<{
  topArtists: Artist[];
  countTopArtists: number;
}> {
  return Promise.all([
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

    return { topArtists: Object.values(tempDict), countTopArtists };
  });
}

async function getAllArtists({
  artistIds,
  count,
  offset = 0,
  allArtists = [],
}: {
  artistIds: string[];
  count: { [id: string]: number };
  offset?: number;
  allArtists?: Artist[];
}): Promise<Artist[]> {
  return await spotifyApi
    .getArtists(artistIds.slice(offset, offset + 50))
    .then((response) => {
      const newArtists = response.artists
        .filter(Boolean) // Spotify returns null for podcast "artists"
        .map((artist) => mapToArtistWithPopularity(artist, count[artist.id]));

      const updatedAllArtists = allArtists.concat(newArtists);

      if (offset + 50 < artistIds.length) {
        return getAllArtists({
          artistIds,
          count,
          offset: offset + 50,
          allArtists: updatedAllArtists,
        });
      } else return updatedAllArtists;
    }, throwError);
}

async function getAllArtistIdsFromPlaylist({
  id,
  offset = 0,
  allArtistIds = [],
}: {
  id: string;
  offset?: number;
  allArtistIds?: string[];
}): Promise<string[]> {
  return await spotifyApi.getPlaylistTracks(id, { offset }).then((tracks) => {
    const newArtistIds: string[] = tracks.items
      // Can also contain podcast episodes, so these need to be filtered out
      .filter((trackItem) => Object.hasOwn(trackItem.track, 'artists'))
      .flatMap((trackItem) =>
        (trackItem.track as SpotifyApi.TrackObjectFull).artists.map(
          (trackArtist) => trackArtist.id,
        ),
      );

    const updatedAllArtistIds = allArtistIds.concat(newArtistIds);

    if (offset + 100 < tracks.total) {
      return getAllArtistIdsFromPlaylist({
        id,
        offset: offset + 100,
        allArtistIds: updatedAllArtistIds,
      });
    } else return updatedAllArtistIds;
  }, throwError);
}

export async function getAllPlaylistArtists({ id }: { id?: string }): Promise<{
  playlistArtists: Artist[];
  numTracks: number;
}> {
  if (!id) return { playlistArtists: [], numTracks: 0 };
  return await getAllArtistIdsFromPlaylist({ id }).then(
    async (allArtistIdsRaw) => {
      const count: { [id: string]: number } = {};
      allArtistIdsRaw.forEach(
        (val: string) => (count[val] = (count[val] || 0) + 1),
      );
      const artistIds = [...new Set(allArtistIdsRaw)].filter(Boolean);
      const newArtists = await getAllArtists({ artistIds, count });

      const numTracks = allArtistIdsRaw.length;

      return { playlistArtists: newArtists, numTracks };
    },
    throwError,
  );
}
