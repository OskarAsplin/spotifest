import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useApiSuspenseQuery, withFallback } from '@src/api/api';
import { getPlaylist, getUserInfo } from '@src/api/spotifyApi';
import { CenteredLoadingSpinner } from '@src/components/atoms/LoadingSpinner/LoadingSpinner';
import { ScrollToTopButton } from '@src/components/atoms/ScrollToTopButton/ScrollToTopButton';
import {
  StandardLink,
  StandardRouterLink,
} from '@src/components/atoms/StandardLink/StandardLink';
import { getIdFromMatchBasis } from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import { FestivalMatchesContainer } from '@src/containers/FestivalMatchesContainer';
import { SharedMatchesSettingsContainer } from '@src/containers/SharedMatchesSettingsContainer';
import { ErrorFallback } from '@src/layouts/ErrorFallback';
import { StyledRootDiv } from '@src/layouts/StyledLayoutComponents';
import { getRouteApi } from '@tanstack/react-router';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const CustomErrorFallback = () => {
  const { t } = useTranslation();
  return <ErrorFallback fallbackText={t('error.invalid_share_url')} />;
};

const route = getRouteApi('/_withProtectedLayout/share/$matchBasis');

export const SharedResultsPage = withFallback(
  SuspenseFallback,
  CustomErrorFallback,
)(() => {
  const { matchBasis } = route.useParams();
  const { playlistId } = getIdFromMatchBasis(matchBasis);

  if (!playlistId) throw 'Invalid match basis';

  const { data: sharedPlaylist } = useApiSuspenseQuery(getPlaylist, {
    params: { id: playlistId },
  });

  const { data: user } = useApiSuspenseQuery(getUserInfo, {
    params: { userId: sharedPlaylist.ownerId },
  });

  return (
    <StyledRootDiv>
      <Box
        sx={{
          width: '100%',
          '@media (min-width: 800px)': { py: 2 },
          '@media (max-width: 799px)': { py: 1 },
        }}
      />
      <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
        <Trans
          i18nKey="shared_results_page.description"
          components={{
            PlaylistLink: <StandardLink href={sharedPlaylist.spotifyUrl} />,
            UserLink: <StandardLink href={user.spotifyUrl} />,
          }}
          values={{
            playlist_name: sharedPlaylist.name,
            user_name: user.displayName ?? user.id,
          }}
        />
      </Typography>
      <Typography variant="subtitle1">
        <Trans
          i18nKey="shared_results_page.test_yourself"
          // @ts-ignore
          components={{ Link: <StandardRouterLink /> }}
          // components={{ Link: ({to}:{to:any})=> <StandardRouterLink to={to} /> }}
        />
      </Typography>
      <Box
        sx={{
          width: '100%',
          '@media (min-width: 800px)': { py: 2 },
          '@media (max-width: 799px)': { py: 1 },
        }}
      />
      <SharedMatchesSettingsContainer sharedMatchBasis={playlistId} />
      <FestivalMatchesContainer sharedMatchBasis={playlistId} />
      <ScrollToTopButton />
    </StyledRootDiv>
  );
});
