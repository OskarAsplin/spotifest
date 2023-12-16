import { getDjangoArtistByName, getDjangoArtistBySpotifyId } from './djangoApi';
import { getArtistInfo } from './spotifyApi';

export const getArtistInfoFromDjangoOrSpotify = async ({
  spotifyId,
  name,
  isLoggedIn,
}: {
  spotifyId?: string;
  name?: string;
  isLoggedIn: boolean;
}) => {
  if (name) return getDjangoArtistByName({ name: name });
  if (spotifyId) {
    if (!isLoggedIn) return getDjangoArtistBySpotifyId({ spotifyId });
    try {
      return getDjangoArtistBySpotifyId({ spotifyId });
    } catch {
      return getArtistInfo({ spotifyId });
    }
  }

  throw "Can't retrieve artist";
};
