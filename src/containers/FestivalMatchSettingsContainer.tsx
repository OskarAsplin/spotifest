import { SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';
import { useApiSuspenseQuery } from '../api/api';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
} from '../api/djangoApi';
import {
  getAllPlaylists,
  getAllTopArtistsWithPopularity,
  getLoggedInUserInfo,
  getOneSavedTrack,
} from '../api/spotifyApi';
import { Area } from '../api/types';
import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import FestivalMatchSettingsBar from '../components/organisms/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import SelectPlaylistModal from '../components/organisms/SelectPlaylistModal/SelectPlaylistModal';
import { MATCHING_MAX_DATE } from '../config';
import { getInitialContinent } from '../utils/areaUtils';
import {
  setDates,
  setMatchArea,
  setMatchBasis,
  useMatchingStore,
} from '../zustand/matchingStore';

const FestivalMatchSettingsContainer = () => {
  const matchBasis = useMatchingStore((state) => state.matchBasis);
  const matchArea = useMatchingStore((state) => state.matchArea);
  const fromDate = useMatchingStore((state) => state.fromDate);
  const toDate = useMatchingStore((state) => state.toDate);

  const { data: countries } = useApiSuspenseQuery(getDjangoAvailableCountries);
  const { data: continents } = useApiSuspenseQuery(
    getDjangoAvailableContinents,
  );

  // Not shared results - get all playlists and top artists
  const { data: userInfo } = useApiSuspenseQuery(getLoggedInUserInfo);
  const { data: playlists } = useApiSuspenseQuery(getAllPlaylists, {
    params: { userId: userInfo.id },
  });
  const {
    data: { artists: topArtists },
  } = useApiSuspenseQuery(getAllTopArtistsWithPopularity);

  const hasTopArtists = !!topArtists.length;
  const { data: savedTracksData } = useApiSuspenseQuery(getOneSavedTrack);
  const hasSavedTracks = !!savedTracksData.total;

  useEffect(() => {
    if (userInfo && continents && !matchArea) {
      const initialArea = getInitialContinent(userInfo.country, continents);
      setMatchArea(initialArea);
    }
  }, [userInfo, continents]);

  const onClickModalGoButton = () => setMatchBasis(TOP_ARTISTS_CHOICE);

  return (
    <>
      <FestivalMatchSettingsBar
        playlists={playlists}
        hasTopArtists={hasTopArtists}
        hasSavedTracks={hasSavedTracks}
        countries={countries}
        continents={continents}
      />
      <SelectPlaylistModal
        open={!matchBasis}
        onClickGoButton={onClickModalGoButton}
        playlists={playlists}
        hasTopArtists={hasTopArtists}
        hasSavedTracks={hasSavedTracks}
        userSpotifyUrl={userInfo?.spotifyUrl}
      />
    </>
  );
};

export default FestivalMatchSettingsContainer;
