import { useSelector } from 'react-redux';
import { useGet } from '../utils/api/api';
import {
  getAllPlaylists,
  getSpotifyLoggedInUserInfo,
} from '../utils/api/spotifyApi';
import SocialMediaButtons from '../components/organisms/SocialMediaButtons/SocialMediaButtons';
import { selectMatchBasis } from '../redux/reducers/matchingSlice';
import { getIdsFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';

const getShareUrl = (matchBasis?: string) =>
  `${process.env.REACT_APP_REDIRECT_URI}/share/${matchBasis}`;

const getTooltipText = (isPublicPlaylist: boolean, matchBasis?: string) => {
  if (!matchBasis) return 'Select a public playlist to share your results';
  if (matchBasis === TOP_ARTISTS_CHOICE)
    return 'Match results for your top artists can unfortunately not be shared as they are not publicly available to other users';
  if (!isPublicPlaylist)
    return 'The selected playlist is private. Only results from public playlists can be shared';
  return 'Share the match results for this playlist!';
};

const getShareMessage = (isOwnPlaylist: boolean, playlistName?: string) =>
  `I matched ${
    isOwnPlaylist ? 'my' : 'the'
  } Spotify playlist "${playlistName}" with music festivals using Spotifest. Check out the results!`;

const SocialMediaButtonsContainer = () => {
  const matchBasis = useSelector(selectMatchBasis);

  const { data: userInfo } = useGet(getSpotifyLoggedInUserInfo);
  const { data: playlists = [] } = useGet(getAllPlaylists, {
    query: { userId: userInfo?.id ?? '' },
    enabled: !!userInfo?.id,
  });

  const { playlistId } = getIdsFromMatchBasis(matchBasis);
  const playlist = playlists.find((p) => p.id === playlistId);

  const isPublicPlaylist = !!playlist?.isPublic;
  const isOwnPlaylist = !!(playlist?.ownerId === userInfo?.id);

  const isDisabled =
    !matchBasis || matchBasis === TOP_ARTISTS_CHOICE || !isPublicPlaylist;

  const shareMessage = getShareMessage(isOwnPlaylist, playlist?.name);
  const shareUrl = getShareUrl(matchBasis);
  const tooltipText = getTooltipText(isPublicPlaylist, matchBasis);

  return (
    <SocialMediaButtons
      message={shareMessage}
      shareUrl={shareUrl}
      tooltipText={tooltipText}
      isDisabled={isDisabled}
    />
  );
};

export default SocialMediaButtonsContainer;
