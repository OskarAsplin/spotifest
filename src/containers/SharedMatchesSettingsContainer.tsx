import { useEffect } from 'react';
import { useApiSuspenseQuery } from '@src/api/api';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
} from '@src/api/djangoApi';
import { getLoggedInUserInfo, getPlaylist } from '@src/api/spotifyApi';
import { getIdFromMatchBasis } from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchSettingsBar from '@src/components/organisms/FestivalMatchSettingsBar/FestivalMatchSettingsBar';
import { getInitialContinent } from '@src/utils/areaUtils';
import { setMatchArea, useMatchingStore } from '@src/zustand/matchingStore';

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
