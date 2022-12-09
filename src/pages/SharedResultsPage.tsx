import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGet, withFallback } from '../api/api';
import { getPlaylist, getUserInfo } from '../api/spotifyApi';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import { StandardLink } from '../components/atoms/StandardLink/StandardLink.stories';
import {
  getIdsFromMatchBasis,
  isValidPlaylistMatchBasis,
} from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import FestivalMatchSettingsContainer from '../containers/FestivalMatchSettingsContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import { getAuthorizeHref } from '../oauthConfig';
import {
  selectLoggedIn,
  setLoggedIn,
} from '../redux/reducers/authorizationSlice';
import '../styles/base.scss';
import {
  getSharedMatchBasis,
  setSharedMatchBasis,
} from '../utils/localStorageUtils';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const CustomErrorFallback = () => {
  const { t } = useTranslation();
  return <ErrorFallback fallbackText={t('error.invalid_share_url')} />;
};

const SharedResultsPage = withFallback(
  SuspenseFallback,
  CustomErrorFallback
)(() => {
  const { matchBasis: matchBasisFromParams } = useParams();
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoggedIn);
  const navigate = useNavigate();

  const matchBasis = matchBasisFromParams ?? getSharedMatchBasis() ?? undefined;

  const { ownerId, playlistId } = getIdsFromMatchBasis(matchBasis);
  const { data: sharedPlaylist } = useGet(getPlaylist, {
    enabled: !!matchBasis && loggedIn,
    query: { ownerId, id: playlistId },
  });

  const { data: user } = useGet(getUserInfo, {
    enabled: !!ownerId && loggedIn,
    query: { userId: ownerId ?? '' },
  });

  if (!getSharedMatchBasis() && !isValidPlaylistMatchBasis(matchBasis))
    throw 'Invalid match basis';

  useEffect(() => {
    if (matchBasis && !loggedIn) {
      // Log in user and set /share as redirect URI.
      // Store the sharedMatchBasis in localStorage,
      // so it can be used to navigate the specific share url on return from the Spotify login.
      // This is all done because Spotify needs predefined redirect URIs, so it needs to be /share instead of dynamic.
      dispatch(setLoggedIn());
      setSharedMatchBasis(matchBasis);
      window.open(getAuthorizeHref('/share'), '_self');
    } else if (!matchBasisFromParams && getSharedMatchBasis()) {
      // This happens on return from the Spotify login in the if statement above.
      navigate(`/share/${getSharedMatchBasis()}`);
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
