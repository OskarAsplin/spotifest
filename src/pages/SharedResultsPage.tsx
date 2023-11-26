import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useApiQuery, withFallback } from '../api/api';
import { getPlaylist, getUserInfo } from '../api/spotifyApi';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import { getIdFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import FestivalMatchSettingsContainer from '../containers/FestivalMatchSettingsContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import { getAuthorizeHref } from '../oauthConfig';
import '../styles/base.scss';
import {
  getSharedMatchBasis,
  setSharedMatchBasis,
} from '../utils/localStorageUtils';
import StandardLink from '../components/atoms/StandardLink/StandardLink';
import { setLoggedIn, useAuthStore } from '../zustand/authStore';
import { shareRoute } from '../Routes';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const CustomErrorFallback = () => {
  const { t } = useTranslation();
  return <ErrorFallback fallbackText={t('error.invalid_share_url')} />;
};

const SharedResultsPage = withFallback(
  SuspenseFallback,
  CustomErrorFallback,
)(() => {
  const { matchBasis: matchBasisFromParams } = useParams({
    from: shareRoute.id,
  });
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const navigate = useNavigate();

  const matchBasis = matchBasisFromParams || getSharedMatchBasis() || undefined;

  const { playlistId } = getIdFromMatchBasis(matchBasis);
  const { data: sharedPlaylist } = useApiQuery(getPlaylist, {
    enabled: !!matchBasis && loggedIn,
    params: { id: playlistId },
  });

  const { data: user } = useApiQuery(getUserInfo, {
    enabled: !!sharedPlaylist?.ownerId && loggedIn,
    params: { userId: sharedPlaylist?.ownerId ?? '' },
  });

  if (!matchBasis) throw 'Invalid match basis';

  useEffect(() => {
    const sharedMatchBasis = getSharedMatchBasis();
    if (matchBasis && !loggedIn) {
      // Log in user and set /share as redirect URI.
      // Store the sharedMatchBasis in localStorage,
      // so it can be used to navigate the specific share url on return from the Spotify login.
      // This is all done because Spotify needs predefined redirect URIs, so it needs to be /share instead of dynamic.
      setLoggedIn();
      setSharedMatchBasis(matchBasis);
      window.open(getAuthorizeHref('/share'), '_self');
    } else if (!matchBasisFromParams && sharedMatchBasis) {
      // This happens on return from the Spotify login in the if statement above.
      navigate({
        to: '/share/$matchBasis',
        params: { matchBasis: sharedMatchBasis },
      });
    }
  }, []);

  if (!loggedIn || !matchBasis) return null;

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
            PlaylistLink: <StandardLink href={sharedPlaylist?.spotifyUrl} />,
            UserLink: <StandardLink href={user?.spotifyUrl} />,
          }}
          values={{
            playlist_name: sharedPlaylist?.name,
            user_name: user?.displayName ?? user?.id,
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
      <FestivalMatchSettingsContainer sharedMatchBasis={matchBasis} />
      <FestivalMatchesContainer sharedMatchBasis={matchBasis} />
    </StyledRootDiv>
  );
});

export default SharedResultsPage;
