import { countries } from 'countries-list';
import { Area } from '@src/api/types';
import { WORLDWIDE_AREA } from '@src/components/molecules/AreaSelect/AreaSelect';
import { europeanRegions, regionMap, usRegions } from './regionUtils';

export const getInitialContinent = (
  userCountryCode: string,
  availableContinents: Area[],
) => {
  const userContinent: string =
    userCountryCode in countries
      ? countries[userCountryCode as keyof typeof countries].continent
      : '';
  const isRegisteredContinent = availableContinents.find(
    (continent) => continent.isoCode === userContinent,
  );
  const isEuropeOrNorthAmerica = ['EU', 'NA'].includes(userContinent);
  return isRegisteredContinent && isEuropeOrNorthAmerica
    ? isRegisteredContinent
    : WORLDWIDE_AREA;
};

export const getAreaFilters = (continents: Area[], area?: Area) => {
  if (!area) return {};
  let continentFilter: string[] = [];
  let countryFilter: string[] = [];
  let stateFilter: string[] = [];

  if (area.isoCode !== WORLDWIDE_AREA.isoCode) {
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
  return { continentFilter, countryFilter, stateFilter };
};
