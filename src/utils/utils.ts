import { WORLDWIDE_AREA } from '../components/AreaSelect/AreaSelect';
import countries_list from 'countries-list/dist/data.json';
import { Area } from '../redux/types';
import { europeanRegions, regionMap, usRegions } from './regionUtils';

export const getShortDateISOString = (date: Date) =>
  date.toISOString().substring(0, date.toISOString().search('T'));

export const getIconPicture = (images: SpotifyApi.ImageObject[]): string => {
  let picture = '';
  if (images.length > 0) {
    images
      .slice()
      .reverse()
      .forEach((image) => {
        if (
          picture === '' &&
          image.height &&
          image.height > 159 &&
          image.width &&
          image.width > 159
        ) {
          picture = image.url;
        }
      });
    if (picture === '') {
      picture = images[0].url;
    }
  }
  return picture;
};

export const getBigPicture = (images: SpotifyApi.ImageObject[]): string => {
  return images.length > 0 ? images[0].url : '';
};

export const displayedLocationName = (location: string): string => {
  return location.search('United States of America') !== -1
    ? location.replace('United States of America', 'United States')
    : location;
};

export const getMaxArtistsInWidth = (
  bigScreen: boolean,
  smallScreen: boolean,
  maxBigScreen: number
) => {
  const vw = Math.min(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const outerMargin = smallScreen ? 32 : 64;
  return bigScreen
    ? Math.min(maxBigScreen, Math.floor((vw - outerMargin) / 100))
    : Math.max(3, Math.floor((vw - outerMargin) / 75));
};

export const getMaxArtistsInFullLineupWidth = (
  bigScreen: boolean,
  smallScreen: boolean,
  maxBigScreen: number
) => {
  const vw = Math.min(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const outerMargin = smallScreen ? 16 : 32;
  return bigScreen
    ? Math.min(maxBigScreen, Math.floor((0.99 * (vw - outerMargin)) / 100))
    : Math.max(3, Math.floor((0.99 * (vw - outerMargin)) / 75));
};

export const getInitialContinent = (
  userCountryCode: string,
  availableContinents: Area[]
) => {
  const userContinent: string =
    userCountryCode in countries_list.countries
      ? countries_list.countries[
          userCountryCode as keyof typeof countries_list.countries
        ].continent
      : '';
  const isRegisteredContinent = availableContinents.find(
    (continent) => continent.isoCode === userContinent
  );
  const isEuropeOrNorthAmerica = ['EU', 'NA'].includes(userContinent);
  return isRegisteredContinent && isEuropeOrNorthAmerica
    ? isRegisteredContinent
    : WORLDWIDE_AREA;
};

export const getAreaFilters = (area?: Area, continents?: Area[]) => {
  if (!area || !continents) return {};
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

export const isMainPage = (url: string) =>
  /spotifest\.app\/?$/.test(url) || /localhost:3000\/?$/.test(url);

export const getArtistPath = (artistName: string, spotifyId?: string) => {
  if (spotifyId) return `/artist/spotifyId=${spotifyId}`;
  return '/artist/' + encodeURIComponent(artistName);
};

export const getFestivalPath = (festivalName: string) =>
  '/festival/' + encodeURIComponent(festivalName);
