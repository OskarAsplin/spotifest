export const getShareUrl = (matchBasis?: string) =>
  `${import.meta.env.VITE_REDIRECT_URI}/share/${matchBasis}`;

export const getTooltipText = (isDisabled: boolean) =>
  isDisabled
    ? 'Select a playlist to share your results'
    : 'Share the match results for this playlist!';

export const getShareMessage = (
  isOwnPlaylist: boolean,
  playlistName?: string,
) =>
  `I matched ${
    isOwnPlaylist ? 'my' : 'the'
  } Spotify playlist "${playlistName}" with music festivals using Spotifest. Check out the results!`;
