export const getShortDateISOString = (date: Date) => date.toISOString().substring(0, date.toISOString().search('T'));

export const getIconPicture = (images: SpotifyApi.ImageObject[]): string => {
    let picture = '';
    if (images.length > 0) {
        images.slice().reverse().forEach((image) => {
            if (picture === '' && image.height && image.height > 159 && image.width && image.width > 159) {
                picture = image.url;
            }
        });
        if (picture === '') {
            picture = images[0].url;
        }
    }
    return picture;
}

export const getBigPicture = (images: SpotifyApi.ImageObject[]): string => {
    return images.length > 0 ? images[0].url : ''
}

export const getMaxArtistsInWidth = (bigScreen: boolean, mediumScreen: boolean, smallScreen: boolean) => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const outerMargin = bigScreen ? 128 : mediumScreen ? 96 : smallScreen ? 48 : 64;
    return bigScreen ? Math.min(7, Math.floor((vw - outerMargin) / 100)) : Math.max(3, Math.floor((vw - outerMargin) / 75));
}
