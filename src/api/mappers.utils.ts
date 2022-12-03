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
