import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { shareMatchesRoute } from '../Routes';
import { useApiSuspenseQuery, withFallback } from '../api/api';
import { getPlaylist, getUserInfo } from '../api/spotifyApi';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import StandardLink from '../components/atoms/StandardLink/StandardLink';
import { getIdFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import SharedMatchesSettingsContainer from '../containers/SharedMatchesSettingsContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import { getAuthorizeHref } from '../oauthConfig';
import '../styles/base.scss';
import { useIsLoggedIn } from '../zustand/authStore';
import { setSharedMatchBasis } from '../zustand/sharedResultsStore';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const CustomErrorFallback = () => {
  const { t } = useTranslation();
  return <ErrorFallback fallbackText={t('error.invalid_share_url')} />;
};

const SharedResultsPage = withFallback(
  SuspenseFallback,
  CustomErrorFallback,
)(() => {
  const loggedIn = useIsLoggedIn();
  const { matchBasis } = shareMatchesRoute.useParams();
  const { playlistId } = getIdFromMatchBasis(matchBasis);

  if (!playlistId) throw 'Invalid match basis';

  useEffect(() => {
    if (matchBasis && !loggedIn) {
      // Set /share as redirect URI.
      // Store the sharedMatchBasis in localStorage,
      // so it can be used to navigate the specific share url on return from the Spotify login.
      // This is all done because Spotify needs predefined redirect URIs, so it needs to be /share instead of dynamic.
      setSharedMatchBasis(matchBasis);
      window.open(getAuthorizeHref('/share'), '_self');
    }
  }, []);

  if (!loggedIn) return null;

  return <SharedResultsPageInner playlistId={playlistId} />;
});

const SharedResultsPageInner = ({ playlistId }: { playlistId: string }) => {
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
          components={{ Link: <StandardLink /> }}
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
    </StyledRootDiv>
  );
};

export default SharedResultsPage;
