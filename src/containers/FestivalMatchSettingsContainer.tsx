import { useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { testFestivalMatches } from '../redux/asyncActions';
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
import { Artist, Area } from '../redux/types';
import {
  getAllArtistIdsFromPlaylist,
  getAllArtists,
} from '../utils/api/spotifyApi';
import SelectPlaylistModal from '../components/SelectPlaylistModal/SelectPlaylistModal';
import FestivalMatchSettingsBar from '../components/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import { TOP_ARTISTS_CHOICE } from '../components/MatchCriteriaSelect/MatchCriteriaSelect';
import { getAreaFilters } from '../utils/utils';

const FestivalMatchSettingsContainer = () => {
  const userInfo = useSelector(selectUserInfo);
  const playlists = useSelector(selectPlaylists);
  const topArtists = useSelector(selectTopArtists);
  const selectedPlaylistArtists = useSelector(selectSelectedPlaylistArtists);
  const countries = useSelector(selectCountries);
  const continents = useSelector(selectContinents);
  const matchSettings = useSelector(selectMatchSettings);
  const showPlaylistModal = useSelector(selectShowPlaylistModal);
  const topArtistsLoaded = useSelector(selectTopArtistsLoaded);
  const playlistsLoaded = useSelector(selectPlaylistsLoaded);
  const isDbOnline = useSelector(selectIsDbOnline);
  const countTopArtists = useSelector(selectCountTopArtists);
  const dispatch = useDispatch();

  useEffect(() => {
    const matchRequestIsValid =
      matchSettings.matchBasis === TOP_ARTISTS_CHOICE
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

  const testMatchesWithGivenSettings = (
    area: Area,
    dateFrom: Date,
    dateTo: Date,
    chosenPlaylistName: string,
    artistsFromPlaylist: Artist[],
    numTracks: number
  ) => {
    const isTopArtists = chosenPlaylistName === TOP_ARTISTS_CHOICE;
    const { continentFilter, countryFilter, stateFilter } = getAreaFilters(
      area,
      continents
    );

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
    if (playlistName === TOP_ARTISTS_CHOICE) {
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

      const allArtistIdsRaw = await getAllArtistIdsFromPlaylist({ playlist });

      const count: { [id: string]: number } = {};
      allArtistIdsRaw.forEach(
        (val: string) => (count[val] = (count[val] || 0) + 1)
      );
      const artistIds = [...new Set(allArtistIdsRaw)].filter(Boolean);
      const newArtists = await getAllArtists({ artistIds, count });

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
      }
    }
  };

  const handleAreaChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;

    const area: Area = {
      name: event.target.name ? event.target.name : '',
      isoCode: event.target.value,
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

  const hidePlaylistModal = () => dispatch(setShowPlaylistModal(false));

  const onClickModalGoButton = () => {
    hidePlaylistModal();
    dispatch(
      setMatchSettings({
        ...matchSettings,
        matchBasis: TOP_ARTISTS_CHOICE,
        numTracks: countTopArtists,
      })
    );
    testMatchesWithGivenSettings(
      matchSettings.area,
      new Date(Date.parse(matchSettings.fromDate)),
      new Date(Date.parse(matchSettings.toDate)),
      TOP_ARTISTS_CHOICE,
      selectedPlaylistArtists,
      countTopArtists
    );
  };

  if (!isDbOnline) return <div />;

  return (
    <>
      <FestivalMatchSettingsBar
        playlists={playlists}
        topArtists={topArtists}
        countries={countries}
        continents={continents}
        matchSettings={matchSettings}
        onChangeHandlers={{
          onPlaylistChange: handlePlaylistChange,
          onAreaChange: handleAreaChange,
          onFromDateChange: handleFromDateChange,
          onToDateChange: handleToDateChange,
        }}
      />
      <SelectPlaylistModal
        open={showPlaylistModal}
        hidePlaylistModal={hidePlaylistModal}
        dataLoaded={topArtistsLoaded && playlistsLoaded}
        onPlaylistChange={handlePlaylistChange}
        onClickGoButton={onClickModalGoButton}
        playlists={playlists}
        topArtists={topArtists}
        userSpotifyUrl={userInfo?.spotifyUrl}
      />
    </>
  );
};

export default FestivalMatchSettingsContainer;
