import { useTranslation } from 'react-i18next';
import { useApiSuspenseQuery } from '@src/api/api';
import { getAllPlaylists, getLoggedInUserInfo } from '@src/api/spotifyApi';
import {
  SAVED_TRACKS_CHOICE,
  TOP_ARTISTS_CHOICE,
} from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { getIdFromMatchBasis } from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import { SocialMediaButtons } from '@src/components/organisms/SocialMediaButtons/SocialMediaButtons';
import { useMatchingStore } from '@src/zustand/matchingStore';

export const SocialMediaButtonsContainer = () => {
  const { t } = useTranslation();
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

  const shareMessage = isOwnPlaylist
    ? t('social_media_buttons.message_my_playlist')
    : t('social_media_buttons.message_other_playlist');
  const shareUrl = `${import.meta.env.VITE_REDIRECT_URI}/share/${matchBasis}`;
  const tooltipText = isDisabled
    ? t('social_media_buttons.tooltip_disabled')
    : t('social_media_buttons.tooltip');

  return (
    <SocialMediaButtons
      message={shareMessage}
      shareUrl={shareUrl}
      tooltipText={tooltipText}
      isDisabled={isDisabled}
    />
  );
};
