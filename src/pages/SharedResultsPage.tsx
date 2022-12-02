import { Box, Typography } from '@mui/material';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import '../styles/base.scss';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import FestivalMatchSettingsContainer from '../containers/FestivalMatchSettingsContainer';
import { useGet, withFallback } from '../utils/api/api';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import FallbackPage from './FallbackPage';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getIdsFromMatchBasis,
  isValidPlaylistMatchBasis,
} from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthorizeHref } from '../oauthConfig';
import {
  selectLoggedIn,
  setLoggedIn,
} from '../redux/reducers/authorizationSlice';
import {
  getSharedMatchBasis,
  setSharedMatchBasis,
} from '../utils/localStorageUtils';
import { getPlaylist, getSpotifyUserInfo } from '../utils/api/spotifyApi';
import { StandardLink } from '../components/atoms/StandardLink/StandardLink.stories';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const ErrorFallback = () => (
  <FallbackPage fallbackText="The url is incorrect or the playlist is not public. Makes sure the playlist is public when using the share function." />
);

const SharedResultsPage = withFallback(
  SuspenseFallback,
  ErrorFallback
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

  const { data: user } = useGet(getSpotifyUserInfo, {
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
      <Typography variant="subtitle1">
        {`Festival matches for `}
        <StandardLink href={sharedPlaylist?.spotifyUrl}>
          {sharedPlaylist?.name}
        </StandardLink>
        {' by '}
        <StandardLink href={user?.spotifyUrl}>
          {user?.displayName ?? user?.id}
        </StandardLink>
      </Typography>
      <Typography variant="subtitle1">
        {'Test with your own playlists '}
        <StandardLink to="/">{'here!'}</StandardLink>
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
