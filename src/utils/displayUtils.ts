export const displayedLocationName = (location: string): string =>
  location.search('United States of America') !== -1
    ? location.replace('United States of America', 'United States')
    : location;

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
