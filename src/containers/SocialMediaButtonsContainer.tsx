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
import {
  getShareMessage,
  getShareUrl,
  getTooltipText,
} from './SocialMediaButtonsContainer.utils';

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
