import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';

export const getShareUrl = (matchBasis?: string) =>
  `${process.env.REACT_APP_REDIRECT_URI}/share/${matchBasis}`;

export const getTooltipText = (
  isPublicPlaylist: boolean,
  matchBasis?: string
) => {
  if (!matchBasis) return 'Select a public playlist to share your results';
  if (matchBasis === TOP_ARTISTS_CHOICE)
    return 'Match results for your top artists can unfortunately not be shared as they are not publicly available to other users';
  if (!isPublicPlaylist)
    return 'The selected playlist is private. Only results from public playlists can be shared';
  return 'Share the match results for this playlist!';
};

export const getShareMessage = (
  isOwnPlaylist: boolean,
  playlistName?: string
) =>
  `I matched ${
    isOwnPlaylist ? 'my' : 'the'
  } Spotify playlist "${playlistName}" with music festivals using Spotifest. Check out the results!`;
