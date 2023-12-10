import { useEffect } from 'react';
import { useApiSuspenseQuery } from '../api/api';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
} from '../api/djangoApi';
import { getLoggedInUserInfo, getPlaylist } from '../api/spotifyApi';
import { getIdFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchSettingsBar from '../components/organisms/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import { getInitialContinent } from '../utils/areaUtils';
import { setMatchArea, useMatchingStore } from '../zustand/matchingStore';

interface SharedMatchesSettingsContainerProps {
  sharedMatchBasis: string;
}

const SharedMatchesSettingsContainer = ({
  sharedMatchBasis,
}: SharedMatchesSettingsContainerProps) => {
  const matchArea = useMatchingStore((state) => state.matchArea);

  const { data: countries } = useApiSuspenseQuery(getDjangoAvailableCountries);
  const { data: continents } = useApiSuspenseQuery(
    getDjangoAvailableContinents,
  );

  const { playlistId } = getIdFromMatchBasis(sharedMatchBasis);
  const { data: sharedPlaylist } = useApiSuspenseQuery(getPlaylist, {
    params: { id: playlistId ?? '' },
  });

  const { data: userInfo } = useApiSuspenseQuery(getLoggedInUserInfo);

  useEffect(() => {
    if (userInfo && continents && !matchArea) {
      const initialArea = getInitialContinent(userInfo.country, continents);
      setMatchArea(initialArea);
    }
  }, [userInfo, continents]);

  return (
    <FestivalMatchSettingsBar
      matchBasis={sharedMatchBasis}
      playlists={[sharedPlaylist]}
      countries={countries}
      continents={continents}
      isMatchBasisFieldDisabled
    />
  );
};

export default SharedMatchesSettingsContainer;
