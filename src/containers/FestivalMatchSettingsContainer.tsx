import { SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';
import { useApiQuery } from '../api/api';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
} from '../api/djangoApi';
import {
  getAllPlaylists,
  getAllTopArtistsWithPopularity,
  getLoggedInUserInfo,
  getPlaylist,
} from '../api/spotifyApi';
import { Area } from '../api/types';
import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { getIdsFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchSettingsBar from '../components/organisms/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import SelectPlaylistModal from '../components/organisms/SelectPlaylistModal/SelectPlaylistModal';
import { getInitialContinent } from '../utils/areaUtils';
import { MATCHING_MAX_DATE } from '../config';
import { useMatchingStore } from '../zustand/matchingStore';

interface FestivalMatchSettingsContainerProps {
  sharedMatchBasis?: string;
}

const FestivalMatchSettingsContainer = ({
  sharedMatchBasis,
}: FestivalMatchSettingsContainerProps) => {
  const matchBasis =
    sharedMatchBasis ?? useMatchingStore((state) => state.matchBasis);
  const matchArea = useMatchingStore((state) => state.matchArea);
  const fromDate = useMatchingStore((state) => state.fromDate);
  const toDate = useMatchingStore((state) => state.toDate);
  const setMatchBasis = useMatchingStore((state) => state.setMatchBasis);
  const setMatchArea = useMatchingStore((state) => state.setMatchArea);
  const setFromDate = useMatchingStore((state) => state.setFromDate);
  const setToDate = useMatchingStore((state) => state.setToDate);
  const setDates = useMatchingStore((state) => state.setDates);

  const { data: countries = [] } = useApiQuery(getDjangoAvailableCountries);
  const { data: continents = [] } = useApiQuery(getDjangoAvailableContinents);

  const isSharedResults = !!sharedMatchBasis;

  // Shared results - only get the shared playlist
  const { ownerId, playlistId } = getIdsFromMatchBasis(sharedMatchBasis);
  const { data: sharedPlaylist } = useApiQuery(getPlaylist, {
    enabled: isSharedResults,
    query: { ownerId, id: playlistId },
  });

  // Not shared results - get all playlists and top artists
  const { data: userInfo } = useApiQuery(getLoggedInUserInfo, {
    enabled: !isSharedResults,
  });
  const { data: playlists = [] } = useApiQuery(getAllPlaylists, {
    query: { userId: userInfo?.id ?? '' },
    enabled: !!userInfo?.id && !isSharedResults,
  });
  const { data: allTopArtistsData } = useApiQuery(
    getAllTopArtistsWithPopularity,
    {
      enabled: !isSharedResults,
    },
  );
  const topArtists = allTopArtistsData?.topArtists ?? [];

  useEffect(() => {
    if (userInfo && continents && !matchArea) {
      const initialArea = getInitialContinent(userInfo.country, continents);
      setMatchArea(initialArea);
    }
  }, [userInfo, continents]);

  if (!matchArea) return <div />;

  const onMatchBasisChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    const matchBasisId = event.target.value;
    if (matchBasisId === matchBasis) return;
    setMatchBasis(matchBasisId);
  };

  const onAreaChange = async (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    const { name, value } = event.target;
    const area: Area = { name, isoCode: value };
    setMatchArea(area);
  };

  const onFromDateChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString();
      if (date > new Date(toDate)) {
        setDates({ fromDate: isoDate, toDate: isoDate });
      } else {
        setFromDate(isoDate);
      }
    }
  };

  const onToDateChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString();
      if (date < new Date(fromDate)) {
        setDates({ fromDate: isoDate, toDate: isoDate });
      } else {
        setToDate(isoDate);
      }
    }
  };

  const onDateRangePreSelect = (range: 2021 | 2022 | 2023 | 'future') => {
    if (typeof range === 'number') {
      const from = new Date(range, 0, 1);
      const to = new Date(range, 11, 31);
      setDates({ fromDate: from.toISOString(), toDate: to.toISOString() });
    } else {
      setDates({
        fromDate: new Date().toISOString(),
        toDate: MATCHING_MAX_DATE.toISOString(),
      });
    }
  };

  const onClickModalGoButton = () => setMatchBasis(TOP_ARTISTS_CHOICE);

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
          onDateRangePreSelect,
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
