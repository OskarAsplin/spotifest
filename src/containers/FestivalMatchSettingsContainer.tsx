import { useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Area } from '../redux/types';
import {
  getAllPlaylists,
  getAllTopArtistsWithPopularity,
  getSpotifyUserInfo,
} from '../utils/api/spotifyApi';
import SelectPlaylistModal from '../components/organisms/SelectPlaylistModal/SelectPlaylistModal';
import FestivalMatchSettingsBar from '../components/organisms/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { useGet } from '../utils/api/api';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
} from '../utils/api/djangoApi';
import { getInitialContinent } from '../utils/utils';
import {
  selectFromDate,
  selectMatchArea,
  selectMatchBasis,
  selectToDate,
  setDates,
  setFromDate,
  setMatchArea,
  setMatchBasis,
  setToDate,
} from '../redux/reducers/matchingSlice';

const FestivalMatchSettingsContainer = () => {
  const matchBasis = useSelector(selectMatchBasis);
  const matchArea = useSelector(selectMatchArea);
  const fromDate = useSelector(selectFromDate);
  const toDate = useSelector(selectToDate);
  const dispatch = useDispatch();

  const { data: userInfo } = useGet(getSpotifyUserInfo);
  const { data: countries = [] } = useGet(getDjangoAvailableCountries);
  const { data: continents = [] } = useGet(getDjangoAvailableContinents);
  const { data: playlists = [] } = useGet(getAllPlaylists, {
    query: { userId: userInfo?.id ?? '' },
    enabled: !!userInfo?.id,
  });
  const { data: allTopArtistsData } = useGet(getAllTopArtistsWithPopularity);
  const topArtists = allTopArtistsData?.topArtists ?? [];

  useEffect(() => {
    if (userInfo && continents && !matchArea) {
      const initialArea = getInitialContinent(userInfo.country, continents);
      dispatch(setMatchArea(initialArea));
    }
  }, [userInfo, continents]);

  if (!matchArea) return <div />;

  const onPlaylistChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    const playlistName = event.target.value;
    if (playlistName === matchBasis) return;
    dispatch(setMatchBasis(playlistName));
  };

  const onAreaChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    const { name, value } = event.target;
    const area: Area = { name, isoCode: value };
    dispatch(setMatchArea(area));
  };

  const onFromDateChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString();
      if (date > new Date(toDate)) {
        dispatch(setDates({ fromDate: isoDate, toDate: isoDate }));
      } else {
        dispatch(setFromDate(isoDate));
      }
    }
  };

  const onToDateChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString();
      if (date < new Date(fromDate)) {
        dispatch(setDates({ fromDate: isoDate, toDate: isoDate }));
      } else {
        dispatch(setToDate(isoDate));
      }
    }
  };

  const onClickModalGoButton = () =>
    dispatch(setMatchBasis(TOP_ARTISTS_CHOICE));

  const matchSettings = {
    matchBasis: matchBasis ?? '',
    area: matchArea,
    fromDate,
    toDate,
    numTracks: 0,
  };

  return (
    <>
      <FestivalMatchSettingsBar
        playlists={playlists}
        topArtists={topArtists}
        countries={countries}
        continents={continents}
        matchSettings={matchSettings}
        onChangeHandlers={{
          onPlaylistChange,
          onAreaChange,
          onFromDateChange,
          onToDateChange,
        }}
      />
      <SelectPlaylistModal
        open={!matchBasis}
        onPlaylistChange={onPlaylistChange}
        onClickGoButton={onClickModalGoButton}
        playlists={playlists}
        topArtists={topArtists}
        userSpotifyUrl={userInfo?.spotifyUrl}
      />
    </>
  );
};

export default FestivalMatchSettingsContainer;
