import { useEffect, useState } from 'react';
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
import { ArrowBackOutlined, MusicNote } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ArtistBubble, {
  StyledAvatarContainerdiv,
} from '../components/ArtistBubble';
import FestivalMatchCard from '../components/FestivalMatchCard';
import { spotifyApi } from '../redux/asyncActions';
import {
  selectLoggedIn,
  selectAccessToken,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import { turnOnLoader, turnOffLoader } from '../redux/reducers/displaySlice';
import { ArtistInfo, Artist } from '../redux/types';
import '../styles/base.scss';
import { fetchToJson, getApiBaseUrl } from '../utils/restUtils';
import {
  getFestivalPath,
  getIconPicture,
  getBigPicture,
  getMaxArtistsInWidth,
} from '../utils/utils';
import { useTheme, styled } from '@mui/material/styles';
import ArtistBox from '../components/ArtistBox';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';

const ArtistPage = () => {
  const loggedIn: boolean = useSelector(selectLoggedIn);
  const accessToken: string = useSelector(selectAccessToken);
  const themeMode = useTheme().palette.mode;
  const dispatch = useDispatch();
  const { artistId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsValidSpotifyId(true);
    setIsArtistInDb(true);
    setArtistInfo(undefined);
    if (artistId && artistId.indexOf('spotifyId=') !== -1) {
      const spotifyId = artistId.substring('spotifyId='.length);
      dispatch(turnOnLoader());
      fetchToJson(
        getApiBaseUrl() + '/onTour/artistInfo/?spotifyId=' + spotifyId
      )
        .then((response: any) => {
          const responseArtist = response as ArtistInfo;
          setArtistInfo(responseArtist);
        })
        .catch((error) => {
          console.log(error);
          if (error instanceof TypeError) {
            setIsNetworkError(true);
          } else {
            setIsArtistInDb(false);
          }
          if (loggedIn && accessToken) {
            spotifyApi.setAccessToken(accessToken);
            spotifyApi
              .getArtist(spotifyId)
              .then(
                (spotifyArtistResponse: SpotifyApi.SingleArtistResponse) => {
                  const bigPicture: string = getBigPicture(
                    spotifyArtistResponse.images
                  );
                  setArtistInfo({
                    artist: {
                      name: spotifyArtistResponse.name,
                      spotifyId: spotifyArtistResponse.id,
                      iconPicture: '',
                      bigPicture: bigPicture,
                      popularity: spotifyArtistResponse.popularity,
                      genres: spotifyArtistResponse.genres,
                    },
                    festivalsFuture: [],
                    festivalsPast: [],
                  });
                }
              )
              .catch((error) => {
                console.log(error);
                if (error.status === 401) {
                  // TODO: check if renewal time and just renew token and redirect to same page.
                  dispatch(setLoggedOff());
                } else {
                  setIsValidSpotifyId(false);
                }
              });
          }
        })
        .finally(() => dispatch(turnOffLoader()));
      if (loggedIn && accessToken) {
        spotifyApi.setAccessToken(accessToken);
        spotifyApi
          .getArtistRelatedArtists(spotifyId)
          .then(
            (
              spotifyArtistResponse: SpotifyApi.ArtistsRelatedArtistsResponse
            ) => {
              if (spotifyArtistResponse.artists.length > 0) {
                const related = spotifyArtistResponse.artists.map(
                  (relArtist) => {
                    const iconPicture: string = getIconPicture(
                      relArtist.images
                    );
                    return {
                      name: relArtist.name,
                      spotifyId: relArtist.id,
                      iconPicture: iconPicture,
                      bigPicture: '',
                      popularity: relArtist.popularity,
                      genres: relArtist.genres,
                    } as Artist;
                  }
                );
                setRelatedArtists(related);
              }
            }
          )
          .catch((error) => {
            console.log(error);
            if (error.status === 401) {
              // TODO: check if renewal time and just renew token and redirect to same page.
              dispatch(setLoggedOff());
            } else {
              setIsValidSpotifyId(false);
            }
          });
      }
    } else {
      if (artistId) {
        dispatch(turnOnLoader());
        fetchToJson(getApiBaseUrl() + '/onTour/artistInfo/?q=' + artistId)
          .then((response: any) => {
            const responseArtist = response as ArtistInfo;
            setArtistInfo(responseArtist);

            if (responseArtist.artist.spotifyId && loggedIn && accessToken) {
              spotifyApi.setAccessToken(accessToken);
              spotifyApi
                .getArtistRelatedArtists(responseArtist.artist.spotifyId)
                .then(
                  (
                    spotifyArtistResponse: SpotifyApi.ArtistsRelatedArtistsResponse
                  ) => {
                    if (spotifyArtistResponse.artists.length > 0) {
                      const related = spotifyArtistResponse.artists.map(
                        (relArtist) => {
                          const iconPicture: string = getIconPicture(
                            relArtist.images
                          );
                          return {
                            name: relArtist.name,
                            spotifyId: relArtist.id,
                            iconPicture: iconPicture,
                            bigPicture: '',
                            popularity: relArtist.popularity,
                            genres: relArtist.genres,
                          } as Artist;
                        }
                      );
                      setRelatedArtists(related);
                    }
                  }
                )
                .catch((error) => {
                  console.log(error);
                  if (error.status === 401) {
                    // TODO: check if renewal time and just renew token and redirect to same page.
                    dispatch(setLoggedOff());
                  } else {
                    setIsValidSpotifyId(false);
                  }
                });
            }
          })
          .catch((error) => {
            console.log(error);
            if (error instanceof TypeError) {
              setIsNetworkError(true);
            } else {
              setIsArtistInDb(false);
            }
          })
          .finally(() => dispatch(turnOffLoader()));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId]);

  const [artistInfo, setArtistInfo] = useState<ArtistInfo | undefined>(
    undefined
  );
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [isArtistInDb, setIsArtistInDb] = useState(true);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [isValidSpotifyId, setIsValidSpotifyId] = useState(true);

  const bigScreen = useMediaQuery('(min-width:690px)');
  const pcScreen = useMediaQuery('(min-width:1300px)');
  const smallScreen = useMediaQuery('(max-width:439px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 6);
  const fillRelatedArtistsWidth =
    maxArtistsInWidth - (relatedArtists.length % maxArtistsInWidth);

  if (!artistInfo) {
    return (
      <>
        {pcScreen && (
          <StyledTopLeftDiv>
            <IconButton
              onClick={() => {
                window.history.back();
                setTimeout(() => navigate('/'), 10);
              }}
            >
              <ArrowBackOutlined fontSize="large" />
            </IconButton>
          </StyledTopLeftDiv>
        )}
        <StyledCenteredDiv>
          <VerticalSpaceDiv />
          <VerticalSpaceDiv />
          {isNetworkError && (
            <Typography variant="subtitle1">
              There seems to be some issue with connecting to our database. Try
              refreshing the page.
            </Typography>
          )}
          {!isNetworkError && (!isArtistInDb || !isValidSpotifyId) && (
            <Typography variant="subtitle1">Could not find artist.</Typography>
          )}
          {!isNetworkError && !artistId && (
            <Typography variant="subtitle1">Invalid URL.</Typography>
          )}
        </StyledCenteredDiv>
      </>
    );
  } else {
    return (
      <>
        {pcScreen && (
          <StyledTopLeftDiv>
            <IconButton
              onClick={() => {
                window.history.back();
                setTimeout(() => navigate('/'), 10);
              }}
            >
              <ArrowBackOutlined fontSize="large" />
            </IconButton>
          </StyledTopLeftDiv>
        )}
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
                    <ArtistBubble
                      artist={artist}
                      key={
                        'avatar_rel_artist_' +
                        artistInfo.artist.name +
                        artist.name
                      }
                      bubbleId={
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
          {isArtistInDb && artistInfo.festivalsFuture.length !== 0 && (
            <StyledCenteredDiv>
              <VerticalSpaceDiv />
              <StyledFestivalsTypography variant={bigScreen ? 'h4' : 'h5'}>
                Attending festivals
              </StyledFestivalsTypography>
              <StyledStack spacing={3}>
                {artistInfo.festivalsFuture.map((festival) => (
                  <FestivalMatchCard
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
          {isArtistInDb && artistInfo.festivalsPast.length !== 0 && (
            <StyledCenteredDiv>
              <VerticalSpaceDiv />
              <StyledFestivalsTypography variant={bigScreen ? 'h4' : 'h5'}>
                Previously attended festivals
              </StyledFestivalsTypography>
              <StyledStack spacing={2}>
                {artistInfo.festivalsPast.map((festival) => (
                  <StyledPastFestivalButton
                    key={
                      'festivals artist attends: ' +
                      festival.name +
                      festival.year
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
                              ? ' (' +
                                festival.date +
                                ', ' +
                                festival.year +
                                ')'
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
          {isNetworkError && (
            <StyledCenteredDiv>
              <VerticalSpaceDiv />
              <VerticalSpaceDiv />
              <Typography variant="subtitle1">
                There seems to be some issue contacting our database. Try
                refreshing the page.
              </Typography>
            </StyledCenteredDiv>
          )}
        </StyledRootDiv>
      </>
    );
  }
};

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
  textTransform: 'none',
  '@media (min-width: 690px)': { padding: spacing(2) },
  '@media (max-width: 689px)': { padding: spacing(1) },
  width: '100%',
  alignItems: 'center',
}));

const StyledTopLeftDiv = styled('div')(({ theme: { spacing } }) => ({
  position: 'absolute',
  top: spacing(8),
  left: spacing(2),
}));

export default ArtistPage;
