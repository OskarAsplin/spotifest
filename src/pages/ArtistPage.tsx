import { MusicNote } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { artistRoute, festivalRoute } from '../Routes';
import { useApiSuspenseQuery, withFallback } from '../api/api';
import { getArtistInfoFromDjangoOrSpotify } from '../api/combinedApi';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import RelatedArtistsContainer from '../containers/RelatedArtistsContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import '../styles/base.scss';
import { getCancelledDateString } from '../utils/dateUtils';
import { useIsLoggedIn } from '../zustand/authStore';
import FestivalMatchCard from '../components/organisms/FestivalMatchCard/FestivalMatchCard';
import { Link } from '@tanstack/react-router';

const getNameOrSpotifyIdFromUrl = (artistId: string) => {
  const hasSpotifyId = !!artistId && artistId.indexOf('spotifyId=') !== -1;
  if (!hasSpotifyId) return { name: artistId, spotifyId: undefined };
  const spotifyId = artistId.substring('spotifyId='.length) || undefined;
  return { spotifyId, name: undefined };
};

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const ArtistPageErrorFallback = () => {
  const { t } = useTranslation();

  return <ErrorFallback fallbackText={t('error.artist_not_found')} />;
};

const ArtistPage = withFallback(
  SuspenseFallback,
  ArtistPageErrorFallback,
)(() => {
  const themeMode = useTheme().palette.mode;
  const { artistId } = artistRoute.useParams();
  const { t } = useTranslation();

  const { name, spotifyId: spotifyIdFromUrl } =
    getNameOrSpotifyIdFromUrl(artistId);

  const isLoggedIn = useIsLoggedIn();

  const { data: artistInfo } = useApiSuspenseQuery(
    getArtistInfoFromDjangoOrSpotify,
    { params: { spotifyId: spotifyIdFromUrl, name, isLoggedIn } },
  );

  const spotifyId = spotifyIdFromUrl || artistInfo.artist.spotifyId;

  const isArtistInDb =
    artistInfo.festivalsFuture.length > 0 ||
    artistInfo.festivalsPast.length > 0;

  const bigScreen = useMediaQuery('(min-width:690px)');

  return (
    <>
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
          {spotifyId && (
            <IconButton
              sx={{ p: 1.5 }}
              color="inherit"
              href={`https://open.spotify.com/artist/${spotifyId}`}
              target="_blank"
            >
              <Avatar
                src="/techIcons/Spotify-Mark.png"
                alt=""
                sx={{ height: 28, width: 28 }}
              />
            </IconButton>
          )}
          {isLoggedIn && !!spotifyId && (
            <RelatedArtistsContainer spotifyId={spotifyId} />
          )}
        </Paper>
        {artistInfo.festivalsFuture.length !== 0 && (
          <StyledCenteredDiv>
            <VerticalSpaceDiv />
            <StyledFestivalsTypography variant={bigScreen ? 'h4' : 'h5'}>
              {t('artist_page.future_festivals')}
            </StyledFestivalsTypography>
            <StyledStack>
              {artistInfo.festivalsFuture.map((festival) => (
                <FestivalMatchCard
                  key={'FestivalMatchCard: ' + festival.name + festival.year}
                  festival={festival}
                  popularArtists={festival.popular_artists}
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
                <Link
                  key={'past festival: ' + festival.name + festival.year}
                  to={festivalRoute.to}
                  params={{ festivalId: encodeURIComponent(festival.name) }}
                  style={{ color: 'inherit', textDecoration: 'inherit' }}
                >
                  <StyledPastFestivalButton variant="outlined">
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
                  </StyledPastFestivalButton>
                </Link>
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
