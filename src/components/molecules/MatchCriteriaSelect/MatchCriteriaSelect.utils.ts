// For backward compatability
const PLAYLIST_ID_SEPARATOR = '__PID__';

export const getIdFromMatchBasis = (matchBasis?: string) => {
  if (!matchBasis) return { playlistId: undefined };

  const separatorIdx = matchBasis.indexOf(PLAYLIST_ID_SEPARATOR);
  if (separatorIdx === -1) {
    return { playlistId: matchBasis };
  } else {
    // Is old share url
    const playlistId = matchBasis.substring(
      separatorIdx + PLAYLIST_ID_SEPARATOR.length,
    );
    return { playlistId };
  }
};
