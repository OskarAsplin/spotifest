import { useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Area } from '../redux/types';
import {
  getAllPlaylists,
  getAllTopArtistsWithPopularity,
  getPlaylist,
  getSpotifyLoggedInUserInfo,
} from '../api/spotifyApi';
import SelectPlaylistModal from '../components/organisms/SelectPlaylistModal/SelectPlaylistModal';
import FestivalMatchSettingsBar from '../components/organisms/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { useGet } from '../api/api';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
} from '../api/djangoApi';
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
import { getIdsFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';

interface FestivalMatchSettingsContainerProps {
  sharedMatchBasis?: string;
}

const FestivalMatchSettingsContainer = ({
  sharedMatchBasis,
}: FestivalMatchSettingsContainerProps) => {
  const matchBasis = sharedMatchBasis ?? useSelector(selectMatchBasis);
  const matchArea = useSelector(selectMatchArea);
  const fromDate = useSelector(selectFromDate);
  const toDate = useSelector(selectToDate);
  const dispatch = useDispatch();

  const { data: countries = [] } = useGet(getDjangoAvailableCountries);
  const { data: continents = [] } = useGet(getDjangoAvailableContinents);

  const isSharedResults = !!sharedMatchBasis;

  // Shared results - only get the shared playlist
  const { ownerId, playlistId } = getIdsFromMatchBasis(sharedMatchBasis);
  const { data: sharedPlaylist } = useGet(getPlaylist, {
    enabled: isSharedResults,
    query: { ownerId, id: playlistId },
  });

  // Not shared results - get all playlists and top artists
  const { data: userInfo } = useGet(getSpotifyLoggedInUserInfo, {
    enabled: !isSharedResults,
  });
  const { data: playlists = [] } = useGet(getAllPlaylists, {
    query: { userId: userInfo?.id ?? '' },
    enabled: !!userInfo?.id && !isSharedResults,
  });
  const { data: allTopArtistsData } = useGet(getAllTopArtistsWithPopularity, {
    enabled: !isSharedResults,
  });
  const topArtists = allTopArtistsData?.topArtists ?? [];

  useEffect(() => {
    if (userInfo && continents && !matchArea) {
      const initialArea = getInitialContinent(userInfo.country, continents);
      dispatch(setMatchArea(initialArea));
    }
  }, [userInfo, continents]);

  if (!matchArea) return <div />;

  const onMatchBasisChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    const matchBasisId = event.target.value;
    if (matchBasisId === matchBasis) return;
    dispatch(setMatchBasis(matchBasisId));
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
        playlists={sharedPlaylist ? [sharedPlaylist] : playlists}
        topArtists={topArtists}
        countries={countries}
        continents={continents}
        matchSettings={matchSettings}
        onChangeHandlers={{
          onMatchBasisChange,
          onAreaChange,
          onFromDateChange,
          onToDateChange,
        }}
        isMatchBasisFieldDisabled={isSharedResults}
      />
      <SelectPlaylistModal
        open={!matchBasis}
        onMatchBasisChange={onMatchBasisChange}
        onClickGoButton={onClickModalGoButton}
        playlists={playlists}
        topArtists={topArtists}
        userSpotifyUrl={userInfo?.spotifyUrl}
      />
    </>
  );
};

export default FestivalMatchSettingsContainer;
