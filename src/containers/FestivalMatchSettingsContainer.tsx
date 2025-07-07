import { useEffect } from 'react';
import { useApiSuspenseQuery } from '@src/api/api';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
} from '@src/api/djangoApi';
import {
  getAllPlaylists,
  getAllTopArtistsWithPopularity,
  getLoggedInUserInfo,
  getOneSavedTrack,
} from '@src/api/spotifyApi';
import { FestivalMatchSettingsBar } from '@src/components/organisms/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import { SelectPlaylistModal } from '@src/components/organisms/SelectPlaylistModal/SelectPlaylistModal';
import { getInitialContinent } from '@src/utils/areaUtils';
import { setMatchArea, useMatchingStore } from '@src/zustand/matchingStore';

export const FestivalMatchSettingsContainer = () => {
  const matchBasis = useMatchingStore((state) => state.matchBasis);
  const matchArea = useMatchingStore((state) => state.matchArea);

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

  return (
    <>
      <FestivalMatchSettingsBar
        matchBasis={matchBasis}
        playlists={playlists}
        hasTopArtists={hasTopArtists}
        hasSavedTracks={hasSavedTracks}
        countries={countries}
        continents={continents}
      />
      <SelectPlaylistModal
        open={!matchBasis}
        playlists={playlists}
        hasTopArtists={hasTopArtists}
        hasSavedTracks={hasSavedTracks}
        userSpotifyUrl={userInfo?.spotifyUrl}
      />
    </>
  );
};
