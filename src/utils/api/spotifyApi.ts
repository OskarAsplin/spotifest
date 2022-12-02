import SpotifyWebApi from 'spotify-web-api-js';
import {
  Artist,
  ArtistInfo,
  MinimalUserInfo,
  Playlist,
  UserInfo,
} from '../../redux/types';
import {
  mapSpotifyArtistToArtist,
  mapSpotifyArtistToArtistInfo,
  mapSpotifyPlaylistToPlaylist,
  mapToArtistWithPopularity,
  mapToMinimalUserInfo,
  mapToUserInfo,
} from './mappers';

const spotifyApi = new SpotifyWebApi();

export const setSpotifyToken = (token: string) =>
  spotifyApi.setAccessToken(token);

export async function getSpotifyLoggedInUserInfo(): Promise<UserInfo> {
  return mapToUserInfo(await spotifyApi.getMe());
}

export async function getSpotifyUserInfo({
  userId,
}: {
  userId: string;
}): Promise<MinimalUserInfo> {
  return mapToMinimalUserInfo(await spotifyApi.getUser(userId));
}

export async function getSpotifyArtistInfo({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<ArtistInfo> {
  return mapSpotifyArtistToArtistInfo(await spotifyApi.getArtist(spotifyId));
}

export async function getSpotifyArtistRelatedArtists({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<Artist[]> {
  return (await spotifyApi.getArtistRelatedArtists(spotifyId)).artists.map(
    mapSpotifyArtistToArtist
  );
}

export async function getPlaylist({
  ownerId,
  id,
}: {
  ownerId?: string;
  id?: string;
}): Promise<Playlist | undefined> {
  if (!id || !ownerId) return undefined;
  const playlist = await spotifyApi.getPlaylist(ownerId, id);
  return mapSpotifyPlaylistToPlaylist(playlist);
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
  const userPlaylists = await spotifyApi.getUserPlaylists(userId, {
    limit: 50,
    offset: offset,
  });
  const playlistsWithTracks: Playlist[] = userPlaylists.items
    .filter((playlist) => playlist.tracks.total > 0)
    .map(mapSpotifyPlaylistToPlaylist);

  const updatedAllPlaylists = allPlaylists.concat(playlistsWithTracks);
  if (userPlaylists.total > offset + 50) {
    return getAllPlaylists({
      userId,
      offset: offset + 50,
      allPlaylists: updatedAllPlaylists,
    });
  } else
    return updatedAllPlaylists.sort((a, b) => a.name.localeCompare(b.name));
}

async function getTopArtistsWithPopularity({
  timeRange,
}: {
  timeRange: 'long_term' | 'medium_term' | 'short_term';
}): Promise<Artist[]> {
  const response = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: timeRange,
  });

  return response.items.map((artist, idx) =>
    mapToArtistWithPopularity(artist, response.items.length * 2 - idx)
  );
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
  const response = await spotifyApi.getArtists(
    artistIds.slice(offset, offset + 50)
  );
  const newArtists = response.artists.map((artist) =>
    mapToArtistWithPopularity(artist, count[artist.id])
  );

  const updatedAllArtists = allArtists.concat(newArtists);

  if (offset + 50 < artistIds.length) {
    return getAllArtists({
      artistIds,
      count,
      offset: offset + 50,
      allArtists: updatedAllArtists,
    });
  } else return updatedAllArtists;
}

async function getAllArtistIdsFromPlaylist({
  ownerId,
  id,
  offset = 0,
  allArtistIds = [],
}: {
  ownerId: string;
  id: string;
  offset?: number;
  allArtistIds?: string[];
}): Promise<string[]> {
  const tracks = await spotifyApi.getPlaylistTracks(ownerId, id, { offset });
  const newArtistIds: string[] = tracks.items.flatMap((trackItem) =>
    trackItem.track.artists.map((trackArtist) => trackArtist.id)
  );

  const updatedAllArtistIds = allArtistIds.concat(newArtistIds);

  if (offset + 100 < tracks.total) {
    return getAllArtistIdsFromPlaylist({
      ownerId,
      id,
      offset: offset + 100,
      allArtistIds: updatedAllArtistIds,
    });
  } else return updatedAllArtistIds;
}

export async function getAllPlaylistArtists({
  ownerId,
  id,
}: {
  ownerId?: string;
  id?: string;
}): Promise<{
  playlistArtists: Artist[];
  numTracks: number;
}> {
  if (!id || !ownerId) return { playlistArtists: [], numTracks: 0 };
  const allArtistIdsRaw = await getAllArtistIdsFromPlaylist({ ownerId, id });

  const count: { [id: string]: number } = {};
  allArtistIdsRaw.forEach(
    (val: string) => (count[val] = (count[val] || 0) + 1)
  );
  const artistIds = [...new Set(allArtistIdsRaw)].filter(Boolean);
  const newArtists = await getAllArtists({ artistIds, count });

  const numTracks = allArtistIdsRaw.length;

  return { playlistArtists: newArtists, numTracks };
}
