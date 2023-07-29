import { MusicNote } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from '@tanstack/router';
import { useApiQuery, withFallback } from '../api/api';
import {
  getDjangoArtistByName,
  getDjangoArtistBySpotifyId,
} from '../api/djangoApi';
import { getArtistInfo, getArtistRelatedArtists } from '../api/spotifyApi';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import { StyledAvatarContainerdiv } from '../components/molecules/ArtistBubble/ArtistBubble';
import ArtistBubbleContainer from '../containers/ArtistBubbleContainer';
import FestivalMatchCardContainer from '../containers/FestivalMatchCardContainer';
import TopLeftBackButtonContainer from '../containers/TopLeftBackButtonContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { ArtistBox, StyledRootDiv } from '../layouts/StyledLayoutComponents';
import '../styles/base.scss';
import { getCancelledDateString } from '../utils/dateUtils';
import { getMaxArtistsInWidth } from '../utils/displayUtils';
import { useAuthStore } from '../zustand/authStore';

const SuspenseFallback = () => <CenteredLoadingSpinner />;

const ArtistPage = withFallback(
  SuspenseFallback,
  ErrorFallback,
)(() => {
  const themeMode = useTheme().palette.mode;
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const hasSpotifyId = !!artistId && artistId.indexOf('spotifyId=') !== -1;
  const spotifyId = hasSpotifyId && artistId?.substring('spotifyId='.length);

  const loggedIn = useAuthStore((state) => state.loggedIn);

  const { data: artistBySpotifyId, isError: isArtistBySpotifyIdError } =
    useApiQuery(getDjangoArtistBySpotifyId, {
      params: { spotifyId: spotifyId || '' },
      enabled: hasSpotifyId,
    });

  const { data: artistByName } = useApiQuery(getDjangoArtistByName, {
    params: { name: artistId ?? '' },
    enabled: !hasSpotifyId && !!artistId,
  });

  const { data: spotifyArtist } = useApiQuery(getArtistInfo, {
    params: { spotifyId: spotifyId || '' },
    enabled: loggedIn && !!isArtistBySpotifyIdError,
  });

  const spotifyIdFromDjango = artistByName?.artist.spotifyId;

  const { data: relatedArtists = [] } = useApiQuery(getArtistRelatedArtists, {
    params: { spotifyId: spotifyId || spotifyIdFromDjango || '' },
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

  if (!artistId) return <ErrorFallback fallbackText={t('error.invalid_url')} />;
  if (!artistInfo)
    return <ErrorFallback fallbackText={t('error.artist_not_found')} />;

  return (
    <>
      {pcScreen && <TopLeftBackButtonContainer />}
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
                <MusicNote fontSize="inherit" />
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
              ? `${t('common.genres')}: ${artistInfo.artist.genres.join(', ')}`
              : t('common.no_genres')}
          </Typography>
          {artistInfo.artist.spotifyId && (
            <IconButton
              sx={{ p: 1.5 }}
              color="inherit"
              href={`https://open.spotify.com/artist/${artistInfo.artist.spotifyId}`}
              target="_blank"
            >
              <Avatar
                src="/techIcons/Spotify-Mark.png"
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
                  {t('artist_page.related_artists')}
                </Typography>
              </Divider>
              <ArtistBox>
                {relatedArtists.slice(0, maxArtistsInWidth).map((artist) => (
                  <ArtistBubbleContainer
                    key={`avatar_rel_artist_${artistInfo.artist.name}${artist.name}`}
                    artist={artist}
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
              {t('artist_page.future_festivals')}
            </StyledFestivalsTypography>
            <StyledStack spacing={3}>
              {artistInfo.festivalsFuture.map((festival) => (
                <FestivalMatchCardContainer
                  key={'FestivalMatchCard: ' + festival.name + festival.year}
                  festival={festival}
                  popularArtists={festival.popular_artists}
                  matchingArtists={[]}
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
              {t('artist_page.past_festivals')}
            </StyledFestivalsTypography>
            <StyledStack spacing={2}>
              {artistInfo.festivalsPast.map((festival) => (
                <StyledPastFestivalButton
                  key={'past festival: ' + festival.name + festival.year}
                  variant="outlined"
                  onClick={() =>
                    navigate({
                      to: '/festival/$festivalId',
                      params: { festivalId: encodeURIComponent(festival.name) },
                    })
                  }
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
                        {getCancelledDateString(festival.date, festival.year)}
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
              {t('artist_page.no_festivals')}
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
  }),
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
