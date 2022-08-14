import { Fragment, useEffect } from 'react';
import {
  Theme,
  Typography,
  Box,
  Paper,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  ListSubheader,
  Modal,
  Fade,
  ThemeProvider,
  CircularProgress,
  Button,
} from '@mui/material';
import { deepOrange, indigo } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import InfoIcon from '@mui/icons-material/Info';
import ReactCountryFlag from 'react-country-flag';
import { useSelector, useDispatch } from 'react-redux';
import { spotifyApi, testFestivalMatches } from '../redux/asyncActions';
import { setLoggedOff } from '../redux/reducers/authorizationSlice';
import {
  selectIsDbOnline,
  selectShowPlaylistModal,
  turnOnLoader,
  setShowPlaylistModal,
} from '../redux/reducers/displaySlice';
import {
  selectMatchSettings,
  selectSelectedPlaylistArtists,
  selectCountries,
  selectContinents,
  setMatchSettings,
  setSelectedPlaylistArtists,
} from '../redux/reducers/festivalMatchingSlice';
import {
  selectUserInfo,
  selectPlaylists,
  selectTopArtists,
  selectTopArtistsLoaded,
  selectPlaylistsLoaded,
  selectCountTopArtists,
} from '../redux/reducers/spotifyAccountSlice';
import {
  Playlist,
  Artist,
  Area,
  MatchSettings,
  UserInfo,
} from '../redux/types';
import { europeanRegions, usRegions, regionMap } from '../utils/regionUtils';
import {
  getIconPicture,
  getBigPicture,
  displayedLocationName,
} from '../utils/utils';
import StandardLink from './StandardLink';
import HtmlTooltip from './HtmlTooltip';
import SettingsBarDatePicker from './SettingsBarDatePicker';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alignItems: {
      display: 'flex',
      '@media (max-width: 799px)': {
        width: '100%',
      },
      alignItems: 'center',
    },
    alignItems2: {
      display: 'flex',
      '@media (min-width: 800px)': {
        width: '316px',
      },
      '@media (max-width: 799px)': {
        width: '100%',
      },
      alignItems: 'center',
      justifyContent: 'center',
    },
    alignItems3: {
      display: 'flex',
      flexDirection: 'column',
      '@media (max-width: 799px)': {
        width: '100%',
      },
      alignItems: 'center',
    },
    formControlPlaylist: {
      margin: theme.spacing(1),
      '@media (min-width: 800px)': {
        minWidth: 150,
        maxWidth: 220,
      },
      '@media (max-width: 799px)': {
        width: '100%',
      },
    },
    formControlArea: {
      margin: theme.spacing(1),
      '@media (min-width: 800px)': {
        minWidth: 150,
        maxWidth: 180,
      },
      '@media (max-width: 799px)': {
        width: '100%',
      },
    },
    formControl2: {
      margin: theme.spacing(1),
      '@media (min-width: 800px)': {
        minWidth: 200,
        maxWidth: 300,
      },
      '@media (max-width: 799px)': {
        minWidth: 150,
        maxWidth: 220,
      },
    },
  })
);

const topArtistsChoice = '__your__top__artists__';

const FestivalMatchSettingsBar = () => {
  const themeMode = useTheme().palette.mode;
  const userInfo: UserInfo | undefined = useSelector(selectUserInfo);
  const playlists: Playlist[] = useSelector(selectPlaylists);
  const topArtists: Artist[] = useSelector(selectTopArtists);
  const selectedPlaylistArtists: Artist[] = useSelector(
    selectSelectedPlaylistArtists
  );
  const countries: Area[] = useSelector(selectCountries);
  const continents: Area[] = useSelector(selectContinents);
  const matchSettings: MatchSettings = useSelector(selectMatchSettings);
  const showPlaylistModal: boolean = useSelector(selectShowPlaylistModal);
  const topArtistsLoaded: boolean = useSelector(selectTopArtistsLoaded);
  const playlistsLoaded: boolean = useSelector(selectPlaylistsLoaded);
  const isDbOnline: boolean = useSelector(selectIsDbOnline);
  const countTopArtists: number = useSelector(selectCountTopArtists);
  const dispatch = useDispatch();

  useEffect(() => {
    const matchRequestIsValid =
      matchSettings.matchBasis === topArtistsChoice
        ? topArtists.length !== 0
        : selectedPlaylistArtists.length !== 0;
    if (!isDbOnline && matchRequestIsValid) {
      testMatchesWithGivenSettings(
        matchSettings.area,
        new Date(Date.parse(matchSettings.fromDate)),
        new Date(Date.parse(matchSettings.toDate)),
        matchSettings.matchBasis,
        selectedPlaylistArtists,
        matchSettings.numTracks
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const smallScreen = useMediaQuery('(max-width:610px)');
  const pcScreen = useMediaQuery('(min-width:1200px)');

  const indigoOrangeMuiTheme = createTheme({
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

  const testMatchesWithGivenSettings = (
    area: Area,
    dateFrom: Date,
    dateTo: Date,
    chosenPlaylistName: string,
    artistsFromPlaylist: Artist[],
    numTracks: number
  ) => {
    const isTopArtists: boolean = chosenPlaylistName === topArtistsChoice;
    let continentFilter: string[] = [];
    let countryFilter: string[] = [];
    let stateFilter: string[] = [];

    if (area.isoCode !== 'XXX') {
      if (continents.find((continent) => continent.isoCode === area.isoCode)) {
        continentFilter = [area.isoCode];
      } else if (europeanRegions.find((region) => region === area.isoCode)) {
        countryFilter = regionMap[area.isoCode];
      } else if (usRegions.find((region) => region === area.isoCode)) {
        countryFilter = ['US'];
        stateFilter = regionMap[area.isoCode];
      } else {
        countryFilter = [area.isoCode];
      }
    }

    dispatch(
      testFestivalMatches(
        isTopArtists ? topArtists : artistsFromPlaylist,
        numTracks,
        isTopArtists,
        dateFrom,
        dateTo,
        continentFilter,
        countryFilter,
        stateFilter
      )
    );
  };

  const handlePlaylistChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;

    const playlistName = event.target.value;
    if (playlistName === matchSettings.matchBasis) {
      return;
    }
    if (playlistName === topArtistsChoice) {
      dispatch(
        setMatchSettings({
          ...matchSettings,
          matchBasis: playlistName,
          numTracks: countTopArtists,
        })
      );
      testMatchesWithGivenSettings(
        matchSettings.area,
        new Date(Date.parse(matchSettings.fromDate)),
        new Date(Date.parse(matchSettings.toDate)),
        playlistName,
        selectedPlaylistArtists,
        countTopArtists
      );
      return;
    }

    const playlist = playlists.find(({ name }) => name === playlistName);

    if (playlist) {
      dispatch(turnOnLoader());

      let allArtistIdsRaw: string[] = [];

      for (let offset = 0; offset < playlist.numTracks; offset += 100) {
        const artistIdsRaw: string[] = await spotifyApi
          .getPlaylistTracks(playlist.ownerId, playlist.id, { offset: offset })
          .then(async (playlistResponse: SpotifyApi.PlaylistTrackResponse) => {
            const artistIdsRaw: string[] = playlistResponse.items.flatMap(
              (trackItem) => {
                return trackItem.track.artists.map((trackArtist) => {
                  return trackArtist.id;
                });
              }
            );
            return artistIdsRaw;
          })
          .catch((error) => {
            console.log(error);
            dispatch(setLoggedOff());
            return [];
          });
        allArtistIdsRaw = allArtistIdsRaw.concat(artistIdsRaw);
      }

      const count: { [id: string]: number } = {};
      allArtistIdsRaw.forEach(
        (val: string) => (count[val] = (count[val] || 0) + 1)
      );
      const artistIds: string[] = [...new Set(allArtistIdsRaw)].filter(
        Boolean
      ) as string[];
      const newArtists: Artist[] = [];

      for (let index = 0; index < artistIds.length; index += 50) {
        await spotifyApi
          .getArtists(artistIds.slice(index, index + 50))
          .then((artistsResponse: SpotifyApi.MultipleArtistsResponse) => {
            artistsResponse.artists.map(
              (artistResponse: SpotifyApi.ArtistObjectFull) => {
                return newArtists.push({
                  name: artistResponse.name,
                  spotifyId: artistResponse.id,
                  hasSpotifyId: true,
                  iconPicture: getIconPicture(artistResponse.images),
                  bigPicture: getBigPicture(artistResponse.images),
                  popularity: artistResponse.popularity,
                  userPopularity: count[artistResponse.id],
                  genres: artistResponse.genres,
                } as Artist);
              }
            );
          })
          .catch((error) => {
            console.log(error);
            dispatch(setLoggedOff());
            return [];
          });
      }

      if (newArtists.length > 0) {
        dispatch(
          setMatchSettings({
            ...matchSettings,
            matchBasis: playlistName,
            numTracks: allArtistIdsRaw.length,
          })
        );
        testMatchesWithGivenSettings(
          matchSettings.area,
          new Date(Date.parse(matchSettings.fromDate)),
          new Date(Date.parse(matchSettings.toDate)),
          playlistName,
          newArtists,
          allArtistIdsRaw.length
        );
        dispatch(setSelectedPlaylistArtists(newArtists));
      } else {
        console.log('Something went wrong. No artists in list');
      }
    } else {
      console.log('Could not find playlist: ' + playlistName);
    }
  };

  const handleAreaChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;

    const area: Area = {
      name: event.target.name ? event.target.name : '',
      isoCode: event.target.value as string,
    };
    if (area.isoCode !== matchSettings.area.isoCode) {
      testMatchesWithGivenSettings(
        area,
        new Date(Date.parse(matchSettings.fromDate)),
        new Date(Date.parse(matchSettings.toDate)),
        matchSettings.matchBasis,
        selectedPlaylistArtists,
        matchSettings.numTracks
      );
      dispatch(setMatchSettings({ ...matchSettings, area: area }));
    }
  };

  const handleFromDateChange = (date: Date | null) => {
    if (date) {
      const toDate = new Date(matchSettings.toDate);
      if (date > toDate) {
        dispatch(
          setMatchSettings({
            ...matchSettings,
            fromDate: date.toISOString(),
            toDate: date.toISOString(),
          })
        );
        testMatchesWithGivenSettings(
          matchSettings.area,
          date,
          date,
          matchSettings.matchBasis,
          selectedPlaylistArtists,
          matchSettings.numTracks
        );
      } else {
        dispatch(
          setMatchSettings({ ...matchSettings, fromDate: date.toISOString() })
        );
        testMatchesWithGivenSettings(
          matchSettings.area,
          date,
          toDate,
          matchSettings.matchBasis,
          selectedPlaylistArtists,
          matchSettings.numTracks
        );
      }
    }
  };

  const handleToDateChange = (date: Date | null) => {
    if (date) {
      const fromDate = new Date(matchSettings.fromDate);
      if (date < fromDate) {
        dispatch(
          setMatchSettings({
            ...matchSettings,
            fromDate: date.toISOString(),
            toDate: date.toISOString(),
          })
        );
        testMatchesWithGivenSettings(
          matchSettings.area,
          date,
          date,
          matchSettings.matchBasis,
          selectedPlaylistArtists,
          matchSettings.numTracks
        );
      } else {
        dispatch(
          setMatchSettings({ ...matchSettings, toDate: date.toISOString() })
        );
        testMatchesWithGivenSettings(
          matchSettings.area,
          fromDate,
          date,
          matchSettings.matchBasis,
          selectedPlaylistArtists,
          matchSettings.numTracks
        );
      }
    }
  };

  const classes = useStyles();

  if (!isDbOnline) return <div />;

  return (
    <>
      <Paper
        sx={{
          width: '100%',
          '@media (min-width: 800px)': {
            maxWidth: '1000px',
            justifyContent: 'space-between',
          },
          '@media (max-width: 799px)': {
            maxWidth: '460px',
          },
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          '@media (min-width: 1000px)': { pt: 0.5, px: 2 },
          '@media (max-width: 999px)': { pt: 0.5, px: 0.5 },
        }}
      >
        <Box className={classes.alignItems}>
          <FormControl className={classes.formControlPlaylist} size="small">
            <InputLabel id="choose-playlist-label">Match with</InputLabel>
            <Select
              labelId="choose-playlist-label"
              id="choose-playlist"
              value={matchSettings.matchBasis}
              onChange={handlePlaylistChange}
              label="Match with"
            >
              {topArtists.length !== 0 && (
                <MenuItem key={topArtistsChoice} value={topArtistsChoice}>
                  Your most played artists
                </MenuItem>
              )}
              {topArtists.length !== 0 && playlists.length !== 0 && (
                <ListSubheader disableSticky disableGutters>
                  or choose a playlist below
                </ListSubheader>
              )}
              {playlists.map((playlist) => (
                <MenuItem
                  key={playlist.name}
                  value={playlist.name}
                  style={{ minWidth: 200, maxWidth: 400 }}
                >
                  {playlist.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className={classes.alignItems}>
          <FormControl className={classes.formControlArea} size="small">
            <InputLabel id="choose-countries-label">Area</InputLabel>
            <Select
              labelId="choose-countries-label"
              id="choose-countries"
              value={matchSettings.area.isoCode}
              onChange={handleAreaChange}
              label="Area"
            >
              <MenuItem key={'XXX'} value={'XXX'} style={{ minWidth: 200 }}>
                Worldwide
              </MenuItem>
              <ListSubheader disableSticky disableGutters>
                Continents
              </ListSubheader>
              {[...continents]
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((continent) => (
                  <MenuItem
                    key={continent.isoCode}
                    value={continent.isoCode}
                    style={{ minWidth: 200 }}
                  >
                    {continent.name}
                  </MenuItem>
                ))}
              <ListSubheader disableSticky disableGutters>
                European regions
              </ListSubheader>
              {europeanRegions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
              <ListSubheader disableSticky disableGutters>
                US regions
              </ListSubheader>
              {usRegions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
              <ListSubheader disableSticky disableGutters>
                Countries
              </ListSubheader>
              {[...countries]
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((country) => (
                  <MenuItem key={country.isoCode} value={country.isoCode}>
                    <ReactCountryFlag
                      countryCode={country.isoCode}
                      svg
                      style={{ marginRight: '8px' }}
                    />{' '}
                    {displayedLocationName(country.name)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
        <Box className={classes.alignItems2}>
          <Grid container justifyContent="space-around" sx={{ mb: 0.5 }}>
            <SettingsBarDatePicker
              label="From"
              value={matchSettings.fromDate}
              onChange={handleFromDateChange}
            />
          </Grid>
          <Grid container justifyContent="space-around" sx={{ mb: 0.5 }}>
            <SettingsBarDatePicker
              label="To"
              value={matchSettings.toDate}
              onChange={handleToDateChange}
            />
          </Grid>
        </Box>
        {pcScreen && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pb: 0.5,
            }}
          >
            <HtmlTooltip
              placement="right-start"
              title={
                <Fragment>
                  <Typography color="inherit" variant="h6">
                    Matching algorithm
                  </Typography>
                  {
                    'The matching algorithm is a combination of artist and genre matching. The number of artists in your selected playlist attending a festival combined with how well the genres of the playlist fit the festival, determines the match score shown on each festival.'
                  }
                </Fragment>
              }
            >
              <InfoIcon
                color="primary"
                style={{
                  fill: themeMode === 'light' ? indigo[500] : '#fcfcfe',
                }}
              />
            </HtmlTooltip>
          </Box>
        )}
      </Paper>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
        BackdropProps={{ timeout: 500 }}
        open={showPlaylistModal}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return;
          dispatch(setShowPlaylistModal(false));
        }}
        disableEscapeKeyDown
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto',
        }}
      >
        <Fade in={showPlaylistModal}>
          <Paper sx={{ p: 2, outline: 'none', backgroundColor: '#303030' }}>
            {!(topArtistsLoaded && playlistsLoaded) && (
              <ThemeProvider theme={indigoOrangeMuiTheme}>
                <CircularProgress
                  size={100}
                  thickness={3}
                  color={'secondary'}
                  sx={{ m: 3 }}
                />
              </ThemeProvider>
            )}
            {topArtistsLoaded && playlistsLoaded && (
              <Box className={classes.alignItems3}>
                <Typography
                  variant={
                    smallScreen ? (topArtists.length === 0 ? 'h6' : 'h5') : 'h4'
                  }
                  sx={{ textAlign: 'center', mb: 1 }}
                >
                  {topArtists.length === 0
                    ? 'Choose a playlist to start your matching'
                    : 'Match festivals with'}
                </Typography>
                <FormControl className={classes.formControl2} size="small">
                  {topArtists.length === 0 && (
                    <InputLabel id="choose-initial-playlist-inputlabel">
                      Playlist
                    </InputLabel>
                  )}
                  <Select
                    labelId="choose-initial-playlist-label"
                    id="choose-initial-playlist"
                    value={topArtists.length !== 0 ? topArtistsChoice : ''}
                    label={topArtists.length === 0 ? 'Playlist' : undefined}
                    onChange={async (event: SelectChangeEvent) => {
                      dispatch(setShowPlaylistModal(false));
                      handlePlaylistChange(event);
                    }}
                  >
                    {topArtists.length !== 0 && (
                      <MenuItem key={topArtistsChoice} value={topArtistsChoice}>
                        Your most played artists
                      </MenuItem>
                    )}
                    {topArtists.length !== 0 && playlists.length !== 0 && (
                      <ListSubheader disableSticky disableGutters>
                        or choose a playlist below
                      </ListSubheader>
                    )}
                    {playlists.map((playlist) => (
                      <MenuItem
                        key={playlist.name}
                        value={playlist.name}
                        style={{ minWidth: 200, maxWidth: 400 }}
                      >
                        {playlist.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            {topArtistsLoaded && playlistsLoaded && topArtists.length !== 0 && (
              <Box className={classes.alignItems3}>
                <Button
                  color="primary"
                  size="large"
                  variant="outlined"
                  sx={{ mt: 3, mb: 1 }}
                  onClick={() => {
                    dispatch(setShowPlaylistModal(false));
                    dispatch(
                      setMatchSettings({
                        ...matchSettings,
                        matchBasis: topArtistsChoice,
                        numTracks: countTopArtists,
                      })
                    );
                    testMatchesWithGivenSettings(
                      matchSettings.area,
                      new Date(Date.parse(matchSettings.fromDate)),
                      new Date(Date.parse(matchSettings.toDate)),
                      topArtistsChoice,
                      selectedPlaylistArtists,
                      countTopArtists
                    );
                  }}
                >
                  <Typography variant={smallScreen ? 'h6' : 'h4'}>
                    <Box fontWeight="fontWeightBold">Go</Box>
                  </Typography>
                </Button>
              </Box>
            )}
            {topArtistsLoaded &&
              playlistsLoaded &&
              topArtists.length === 0 &&
              playlists.length === 0 && (
                <Typography>
                  {
                    "We can't find any listening habits or playlists to use for our festival matching. Go to your "
                  }
                  {userInfo && userInfo.spotifyUrl ? (
                    <StandardLink href={userInfo.spotifyUrl}>
                      Spotify profile
                    </StandardLink>
                  ) : (
                    'Spotify profile'
                  )}
                  {
                    ' and create or subscribe to a playlist to start your festival matching'
                  }
                </Typography>
              )}
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default FestivalMatchSettingsBar;
