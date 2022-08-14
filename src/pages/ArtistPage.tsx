import { useEffect, useState } from 'react';
import {
  ThemeProvider,
  Theme,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Collapse,
  CircularProgress,
  Stack,
} from '@mui/material';
import { deepOrange, indigo } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { ArrowBackOutlined, MusicNote } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import ArtistBubble from '../components/ArtistBubble';
import FestivalMatchCard from '../components/FestivalMatchCard';
import { spotifyApi } from '../redux/asyncActions';
import {
  selectLoggedIn,
  selectAccessToken,
  setLoggedOff,
} from '../redux/reducers/authorizationSlice';
import {
  selectLoaderOn,
  turnOnLoader,
  turnOffLoader,
} from '../redux/reducers/displaySlice';
import { ArtistInfo, Artist } from '../redux/types';
import '../styles/base.scss';
import { fetchToJson, getApiBaseUrl } from '../utils/restUtils';
import {
  getIconPicture,
  getBigPicture,
  getMaxArtistsInWidth,
} from '../utils/utils';
import StandardLink from '../components/StandardLink';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles(({ spacing, transitions }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '@media (min-width: 440px)': {
        padding: spacing(0, 2, 0, 2),
      },
      '@media (max-width: 439px)': {
        padding: spacing(0, 1, 0, 1),
      },
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    verticalSpace: {
      display: 'flex',
      '@media (min-width: 690px)': {
        padding: spacing(2, 0, 2, 0),
      },
      '@media (max-width: 689px)': {
        padding: spacing(1, 0, 1, 0),
      },
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    addSidePadding: {
      '@media (min-width: 690px)': {
        padding: spacing(0, 4, 0, 4),
      },
      '@media (max-width: 689px)': {
        '@media (min-width: 440px)': {
          padding: spacing(0, 2, 0, 2),
        },
      },
      '@media (max-width: 439px)': {
        padding: spacing(0, 2, 0, 2),
      },
    },
    addSmallSidePadding: {
      '@media (min-width: 440px)': {
        padding: spacing(0, 2, 0, 2),
      },
      '@media (max-width: 439px)': {
        padding: spacing(0, 1, 0, 1),
      },
    },
    buttonBox: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: spacing(1, 0, 1, 0),
    },
    darkerBackground: {
      backgroundColor: '#303030',
    },
    artistImg: {
      maxHeight: '350px',
      maxWidth: '100%',
    },
    hundredWidth: {
      width: '100%',
    },
    align: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    artistAvatarBox: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      '@media (max-width: 439px)': {
        padding: spacing(0, 1, 0, 1),
      },
    },
    matchingPopularBox: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      minHeight: '48px',
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: transitions.create('transform', {
        duration: transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    prevAndFutureFestivalsTitle: {
      '@media (max-width: 689px)': {
        textAlign: 'center',
      },
      marginBottom: spacing(1),
    },
    topLeft: {
      position: 'absolute',
      top: spacing(8),
      left: spacing(2),
    },
    artistWidth: {
      '@media (min-width: 690px)': {
        width: '100px',
      },
      '@media (max-width: 689px)': {
        width: '75px',
      },
    },
    paddingBottom: {
      paddingBottom: spacing(1),
    },
    noBigPicture: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: spacing(3),
      paddingTop: spacing(3),
      '@media (min-width: 690px)': {
        fontSize: '150px',
      },
      '@media (max-width: 689px)': {
        fontSize: '80px',
      },
    },
  })
);

const ArtistPage = () => {
  const loggedIn: boolean = useSelector(selectLoggedIn);
  const accessToken: string = useSelector(selectAccessToken);
  const loaderOn: boolean = useSelector(selectLoaderOn);
  const themeMode = useTheme().palette.mode;
  const dispatch = useDispatch();
  const { artistId } = useParams();

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
                      hasSpotifyId: true,
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
                      hasSpotifyId: true,
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
                            hasSpotifyId: true,
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
  const [redirectHome, setRedirectHome] = useState<boolean>(false);
  const [redirectFestival, setRedirectFestival] = useState('');
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [isArtistInDb, setIsArtistInDb] = useState(true);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [isValidSpotifyId, setIsValidSpotifyId] = useState(true);

  const bigScreen = useMediaQuery('(min-width:690px)');
  const pcScreen = useMediaQuery('(min-width:1300px)');
  const smallScreen = useMediaQuery('(max-width:439px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 6);
  const fillRelatedArtistsWidth =
    maxArtistsInWidth - (relatedArtists.length % maxArtistsInWidth);

  const indigoOrangeMuiTheme = createTheme({
    typography: {
      fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
    },
    palette: {
      primary: {
        light: indigo[300],
        main: indigo[500],
        dark: indigo[700],
      },
      secondary: {
        light: deepOrange[300],
        main: deepOrange[500],
        dark: deepOrange[700],
      },
    },
  });

  const classes = useStyles();

  if (redirectFestival)
    return <Navigate to={'/festival/' + redirectFestival} />;

  if (redirectHome) return <Navigate to={'/'} />;

  if (!artistInfo) {
    return (
      <ThemeProvider theme={indigoOrangeMuiTheme}>
        {pcScreen && (
          <div className={classes.topLeft}>
            <IconButton
              onClick={() => {
                window.history.back();
                setTimeout(() => setRedirectHome(true), 10);
              }}
            >
              <ArrowBackOutlined fontSize="large" />
            </IconButton>
          </div>
        )}
        <div className={classes.align}>
          <div className={classes.verticalSpace} />
          <div className={classes.verticalSpace} />
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
        </div>
        <div hidden={!loaderOn} className="progressBar">
          <CircularProgress size={100} thickness={3} color={'secondary'} />
        </div>
      </ThemeProvider>
    );
  } else {
    return (
      <>
        {pcScreen && (
          <div className={classes.topLeft}>
            <IconButton
              onClick={() => {
                window.history.back();
                setTimeout(() => setRedirectHome(true), 10);
              }}
            >
              <ArrowBackOutlined fontSize="large" />
            </IconButton>
          </div>
        )}
        <div className={classes.verticalSpace} />

        <div className={classes.root}>
          <Paper
            elevation={10}
            sx={{ width: '100%', maxWidth: '700px', mx: 2, mb: 2 }}
            key={'artistInfo:' + artistInfo.artist.name}
          >
            <Typography
              variant={bigScreen ? 'h3' : 'h5'}
              sx={{ textAlign: 'center', width: '100%', mt: 1 }}
            >
              <Box fontWeight="fontWeightBold">{artistInfo.artist.name}</Box>
            </Typography>
            <Box
              className={
                themeMode === 'light'
                  ? classes.buttonBox
                  : clsx(classes.buttonBox, classes.darkerBackground)
              }
            >
              {artistInfo.artist.bigPicture ? (
                <Button
                  onClick={() =>
                    window.open(artistInfo.artist.bigPicture, '_blank')
                  }
                  sx={{ p: 0, borderRadius: 0 }}
                >
                  <img
                    className={classes.artistImg}
                    src={artistInfo.artist.bigPicture}
                    alt=""
                  />
                </Button>
              ) : (
                <div className={classes.noBigPicture}>
                  <MusicNote fontSize={'inherit'} />
                </div>
              )}
            </Box>
            <Typography variant="subtitle1" className={classes.addSidePadding}>
              {artistInfo.artist.genres.length > 0
                ? 'Genres: ' + artistInfo.artist.genres.join(', ')
                : 'No registered genres'}
            </Typography>
            {artistInfo.artist.spotifyId && (
              <ThemeProvider theme={indigoOrangeMuiTheme}>
                <StandardLink
                  color={'secondary'}
                  variant="subtitle1"
                  href={
                    'https://open.spotify.com/artist/' +
                    artistInfo.artist.spotifyId
                  }
                  className={classes.addSidePadding}
                >
                  Open artist in spotify
                </StandardLink>
              </ThemeProvider>
            )}
            {relatedArtists.length === 0 && (
              <div className={classes.paddingBottom} />
            )}
            {relatedArtists.length > 0 && (
              <div
                className={clsx(
                  classes.matchingPopularBox,
                  classes.addSidePadding
                )}
              >
                <Typography variant="body1" color="primary" component="div">
                  <Box
                    fontWeight="fontWeightBold"
                    onClick={() => setExpanded(!expanded)}
                  >
                    Related artists
                  </Box>
                </Typography>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </div>
            )}
            {relatedArtists.length > 0 && (
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div
                  className={clsx(
                    classes.artistAvatarBox,
                    classes.addSmallSidePadding,
                    classes.paddingBottom
                  )}
                >
                  {relatedArtists.slice(0, maxArtistsInWidth).map((artist) => (
                    <ArtistBubble
                      artist={artist}
                      useSpotifyId={true}
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
                      <div className={classes.artistWidth} key={i} />
                    ))}
                </div>
              </Collapse>
            )}
          </Paper>
          {isArtistInDb && artistInfo.festivalsFuture.length !== 0 && (
            <div className={classes.align}>
              <div className={classes.verticalSpace} />
              <Typography
                variant={bigScreen ? 'h4' : 'h5'}
                className={classes.prevAndFutureFestivalsTitle}
              >
                Attending festivals
              </Typography>
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
            </div>
          )}
          {isArtistInDb && artistInfo.festivalsPast.length !== 0 && (
            <div className={classes.align}>
              <div className={classes.verticalSpace} />
              <Typography
                variant={bigScreen ? 'h4' : 'h5'}
                className={classes.prevAndFutureFestivalsTitle}
              >
                Previously attended festivals
              </Typography>
              <StyledStack spacing={2}>
                {artistInfo.festivalsPast.map((festival) => (
                  <StyledPastFestivalButton
                    key={
                      'festivals artist attends: ' +
                      festival.name +
                      festival.year
                    }
                    variant="outlined"
                    onClick={() => {
                      setRedirectFestival(encodeURIComponent(festival.name));
                    }}
                  >
                    <>
                      <Typography
                        variant={bigScreen ? 'h3' : 'h5'}
                        sx={{ wordWrap: 'break-word', textAlign: 'center' }}
                      >
                        <Box fontWeight="fontWeightBold">{festival.name}</Box>
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
            </div>
          )}
          {!isArtistInDb && (
            <div className={classes.align}>
              <div className={classes.verticalSpace} />
              <Typography variant="subtitle1">
                This artist has no registered festivals in our database.
              </Typography>
              <div className={classes.verticalSpace} />
            </div>
          )}
          {isNetworkError && (
            <div className={classes.align}>
              <div className={classes.verticalSpace} />
              <div className={classes.verticalSpace} />
              <Typography variant="subtitle1">
                There seems to be some issue contacting our database. Try
                refreshing the page.
              </Typography>
            </div>
          )}
        </div>

        <ThemeProvider theme={indigoOrangeMuiTheme}>
          <div hidden={!loaderOn} className="progressBar">
            <CircularProgress size={100} thickness={3} color={'secondary'} />
          </div>
        </ThemeProvider>
      </>
    );
  }
};

const StyledStack = styled(Stack)(({ theme: { spacing } }) => {
  return {
    width: '100%',
    maxWidth: '764px',
    marginBottom: spacing(2),
  };
});

const StyledPastFestivalButton = styled(Button)(({ theme: { spacing } }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    textTransform: 'none',
    '@media (min-width: 690px)': {
      padding: spacing(2),
    },
    '@media (max-width: 689px)': {
      padding: spacing(1),
    },
    width: '100%',
    alignItems: 'center',
  };
});

export default ArtistPage;
