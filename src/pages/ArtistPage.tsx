import {
  Avatar,
  Divider,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { MusicNote } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ArtistBubbleContainer from '../containers/ArtistBubbleContainer';
import { StyledAvatarContainerdiv } from '../components/molecules/ArtistBubble/ArtistBubble';
import FestivalMatchCardContainer from '../containers/FestivalMatchCardContainer';
import '../styles/base.scss';
import { getFestivalPath, getMaxArtistsInWidth } from '../utils/utils';
import { useTheme, styled } from '@mui/material/styles';
import { ArtistBox, StyledRootDiv } from '../layouts/StyledLayoutComponents';
import BackCircleButtonContainer from '../containers/BackCircleButtonContainer';
import {
  getDjangoArtistByName,
  getDjangoArtistBySpotifyId,
} from '../utils/api/djangoApi';
import {
  getSpotifyArtistInfo,
  getSpotifyArtistRelatedArtists,
} from '../utils/api/spotifyApi';
import { useGet, withFallback } from '../utils/api/api';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import FallbackPage from './FallbackPage';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from '../redux/reducers/authorizationSlice';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const ErrorFallback = () => (
  <FallbackPage fallbackText="There seems to be some issue with connecting to our database. Try refreshing the page." />
);

const ArtistPage = withFallback(
  SuspenseFallback,
  ErrorFallback
)(() => {
  const themeMode = useTheme().palette.mode;
  const { artistId } = useParams();
  const navigate = useNavigate();

  const hasSpotifyId = !!artistId && artistId.indexOf('spotifyId=') !== -1;
  const spotifyId = hasSpotifyId && artistId?.substring('spotifyId='.length);

  const loggedIn = useSelector(selectLoggedIn);

  const { data: artistBySpotifyId, isError: isArtistBySpotifyIdError } = useGet(
    getDjangoArtistBySpotifyId,
    {
      query: { spotifyId: spotifyId || '' },
      enabled: hasSpotifyId,
    }
  );

  const { data: artistByName } = useGet(getDjangoArtistByName, {
    query: { name: artistId ?? '' },
    enabled: !hasSpotifyId && !!artistId,
  });

  const { data: spotifyArtist } = useGet(getSpotifyArtistInfo, {
    query: { spotifyId: spotifyId || '' },
    enabled: loggedIn && !!isArtistBySpotifyIdError,
  });

  const spotifyIdFromDjango = artistByName?.artist.spotifyId;

  const { data: relatedArtists = [] } = useGet(getSpotifyArtistRelatedArtists, {
    query: { spotifyId: spotifyId || spotifyIdFromDjango || '' },
    enabled: loggedIn && (hasSpotifyId || !!spotifyIdFromDjango),
  });

  const artistInfo = artistBySpotifyId || artistByName || spotifyArtist;
  const isArtistInDb = !!artistBySpotifyId || !!artistByName;

  const bigScreen = useMediaQuery('(min-width:690px)');
  const pcScreen = useMediaQuery('(min-width:1300px)');
  const smallScreen = useMediaQuery('(max-width:439px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 6);
  const fillRelatedArtistsWidth =
    maxArtistsInWidth - (relatedArtists.length % maxArtistsInWidth);

  if (!artistId) return <FallbackPage fallbackText="Invalid URL." />;
  if (!artistInfo)
    return <FallbackPage fallbackText="Could not find artist." />;

  return (
    <>
      {pcScreen && <BackCircleButtonContainer />}
      <VerticalSpaceDiv />

      <StyledRootDiv>
        <Paper
          elevation={10}
          sx={{
            width: '100%',
            maxWidth: '700px',
            mx: 2,
            mb: 2,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={'artistInfo:' + artistInfo.artist.name}
        >
          <Typography
            variant={bigScreen ? 'h3' : 'h4'}
            sx={{
              textAlign: 'center',
              width: '100%',
              mt: 1,
              fontWeight: 'bold',
            }}
          >
            {artistInfo.artist.name}
          </Typography>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 1,
              ...(themeMode === 'dark' ? { backgroundColor: '#303030' } : {}),
            }}
          >
            {artistInfo.artist.bigPicture ? (
              <StyledImg src={artistInfo.artist.bigPicture} alt="" />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 3,
                  '@media (min-width: 690px)': { fontSize: '150px' },
                  '@media (max-width: 689px)': { fontSize: '80px' },
                }}
              >
                <MusicNote fontSize={'inherit'} />
              </Box>
            )}
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              '@media (min-width: 690px)': { px: 4 },
              '@media (max-width: 689px)': {
                '@media (min-width: 440px)': { px: 2 },
              },
              '@media (max-width: 439px)': { px: 2 },
            }}
          >
            {artistInfo.artist.genres.length > 0
              ? 'Genres: ' + artistInfo.artist.genres.join(', ')
              : 'No registered genres'}
          </Typography>
          {artistInfo.artist.spotifyId && (
            <IconButton
              sx={{ p: 1.5 }}
              color="inherit"
              onClick={() =>
                window.open(
                  `https://open.spotify.com/artist/${artistInfo.artist.spotifyId}`,
                  '_blank'
                )
              }
            >
              <Avatar
                src={process.env.PUBLIC_URL + '/techIcons/Spotify-Mark.png'}
                alt=""
                sx={{ height: 28, width: 28 }}
              />
            </IconButton>
          )}
          {relatedArtists.length > 0 && (
            <>
              <Divider sx={{ width: '100%' }}>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  Related artists
                </Typography>
              </Divider>
              <ArtistBox>
                {relatedArtists.slice(0, maxArtistsInWidth).map((artist) => (
                  <ArtistBubbleContainer
                    artist={artist}
                    key={
                      'avatar_rel_artist_' +
                      artistInfo.artist.name +
                      artist.name
                    }
                  />
                ))}
                {relatedArtists.length > 0 &&
                  Array.from({ length: fillRelatedArtistsWidth }, (_, i) => (
                    <StyledAvatarContainerdiv key={i} />
                  ))}
              </ArtistBox>
            </>
          )}
        </Paper>
        {artistInfo.festivalsFuture.length !== 0 && (
          <StyledCenteredDiv>
            <VerticalSpaceDiv />
            <StyledFestivalsTypography variant={bigScreen ? 'h4' : 'h5'}>
              Attending festivals
            </StyledFestivalsTypography>
            <StyledStack spacing={3}>
              {artistInfo.festivalsFuture.map((festival) => (
                <FestivalMatchCardContainer
                  festival={festival}
                  popularArtists={festival.popular_artists}
                  matchingArtists={[]}
                  key={'FestivalMatchCard: ' + festival.name + festival.year}
                  showMatching={false}
                />
              ))}
            </StyledStack>
          </StyledCenteredDiv>
        )}
        {artistInfo.festivalsPast.length !== 0 && (
          <StyledCenteredDiv>
            <VerticalSpaceDiv />
            <StyledFestivalsTypography variant={bigScreen ? 'h4' : 'h5'}>
              Previously attended festivals
            </StyledFestivalsTypography>
            <StyledStack spacing={2}>
              {artistInfo.festivalsPast.map((festival) => (
                <StyledPastFestivalButton
                  key={
                    'festivals artist attends: ' + festival.name + festival.year
                  }
                  variant="outlined"
                  onClick={() => navigate(getFestivalPath(festival.name))}
                >
                  <>
                    <Typography
                      variant={bigScreen ? 'h3' : 'h5'}
                      sx={{
                        wordWrap: 'break-word',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {festival.name}
                    </Typography>
                    {festival.cancelled ? (
                      <Typography variant="subtitle1" color="secondary">
                        {'CANCELLED' +
                          (festival.date
                            ? ' (' + festival.date + ', ' + festival.year + ')'
                            : '')}
                      </Typography>
                    ) : (
                      <Typography variant="subtitle1">
                        {festival.date + ', ' + festival.year}
                      </Typography>
                    )}
                    <Typography variant="subtitle1">
                      {festival.locationText}
                    </Typography>
                  </>
                </StyledPastFestivalButton>
              ))}
            </StyledStack>
          </StyledCenteredDiv>
        )}
        {!isArtistInDb && (
          <StyledCenteredDiv>
            <VerticalSpaceDiv />
            <Typography variant="subtitle1">
              This artist has no registered festivals in our database.
            </Typography>
            <VerticalSpaceDiv />
          </StyledCenteredDiv>
        )}
      </StyledRootDiv>
    </>
  );
});

const VerticalSpaceDiv = styled('div')(({ theme: { spacing } }) => ({
  '@media (min-width: 690px)': { padding: spacing(2) },
  '@media (max-width: 689px)': { padding: spacing(1) },
  width: '100%',
}));

const StyledImg = styled('img')(() => ({
  maxHeight: '350px',
  maxWidth: '100%',
}));

const StyledCenteredDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
}));

const StyledFestivalsTypography = styled(Typography)(
  ({ theme: { spacing } }) => ({
    marginBottom: spacing(1),
    '@media (max-width: 689px)': { textAlign: 'center' },
  })
);

const StyledStack = styled(Stack)(({ theme: { spacing } }) => ({
  width: '100%',
  maxWidth: '764px',
  marginBottom: spacing(2),
}));

const StyledPastFestivalButton = styled(Button)(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  textTransform: 'none',
  '@media (min-width: 690px)': { padding: spacing(2) },
  '@media (max-width: 689px)': { padding: spacing(1) },
}));

export default ArtistPage;
