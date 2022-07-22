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
