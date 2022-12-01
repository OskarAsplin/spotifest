import { Playlist } from '../../../redux/types';

export const PLAYLIST_ID_SEPARATOR = '__PID__';

export const getPlaylistKey = (playlist: Playlist) =>
  `${playlist.ownerId}${PLAYLIST_ID_SEPARATOR}${playlist.id}`;

export const getIdsFromMatchBasis = (matchBasis?: string) => {
  if (!matchBasis || matchBasis.indexOf(PLAYLIST_ID_SEPARATOR) === -1)
    return { ownerId: undefined, playlistId: undefined };

  const separatorIdx = matchBasis.indexOf(PLAYLIST_ID_SEPARATOR);
  const ownerId = matchBasis.substring(0, separatorIdx);
  const playlistId = matchBasis.substring(
    separatorIdx + PLAYLIST_ID_SEPARATOR.length
  );
  return { ownerId, playlistId };
};
