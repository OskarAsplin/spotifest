import { useApiSuspenseQuery } from '@src/api/api';
import { getAllPlaylists, getLoggedInUserInfo } from '@src/api/spotifyApi';
import {
  SAVED_TRACKS_CHOICE,
  TOP_ARTISTS_CHOICE,
} from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { getIdFromMatchBasis } from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import SocialMediaButtons from '@src/components/organisms/SocialMediaButtons/SocialMediaButtons';
import {
  getShareMessage,
  getShareUrl,
  getTooltipText,
} from './SocialMediaButtonsContainer.utils';
import { useMatchingStore } from '@src/zustand/matchingStore';

const SocialMediaButtonsContainer = () => {
  const matchBasis = useMatchingStore((state) => state.matchBasis);

  const { data: userInfo } = useApiSuspenseQuery(getLoggedInUserInfo);
  const { data: playlists } = useApiSuspenseQuery(getAllPlaylists, {
    params: { userId: userInfo.id },
  });

  const { playlistId } = getIdFromMatchBasis(matchBasis);
  const playlist = playlists.find((p) => p.id === playlistId);

  const isOwnPlaylist = !!(playlist?.ownerId === userInfo?.id);
  const isDisabled =
    !matchBasis ||
    matchBasis === TOP_ARTISTS_CHOICE ||
    matchBasis === SAVED_TRACKS_CHOICE;

  const shareMessage = getShareMessage(isOwnPlaylist, playlist?.name);
  const shareUrl = getShareUrl(matchBasis);
  const tooltipText = getTooltipText(isDisabled);

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
