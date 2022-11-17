import SpotifyWebApi from 'spotify-web-api-js';
import { Artist, ArtistInfo, Playlist } from '../../redux/types';
import {
  mapSpotifyArtistToArtist,
  mapSpotifyArtistToArtistInfo,
  mapSpotifyPlaylistToPlaylist,
  mapToArtistWithPopularity,
} from './mappers';

export const spotifyApi = new SpotifyWebApi();

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
  } else return updatedAllPlaylists;
}

export async function getAllArtistIdsFromPlaylist({
  playlist,
  offset = 0,
  allArtistIds = [],
}: {
  playlist: Playlist;
  offset?: number;
  allArtistIds?: string[];
}): Promise<string[]> {
  const { id, ownerId, numTracks } = playlist;
  const tracks = await spotifyApi.getPlaylistTracks(ownerId, id, { offset });
  const newArtistIds: string[] = tracks.items.flatMap((trackItem) =>
    trackItem.track.artists.map((trackArtist) => trackArtist.id)
  );

  const updatedAllArtistIds = allArtistIds.concat(newArtistIds);

  if (offset + 100 < numTracks) {
    return getAllArtistIdsFromPlaylist({
      playlist,
      offset: offset + 100,
      allArtistIds: updatedAllArtistIds,
    });
  } else return updatedAllArtistIds;
}

export async function getAllArtists({
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
