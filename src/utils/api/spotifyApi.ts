import { spotifyApi } from '../../redux/asyncActions';
import { getBigPicture, getIconPicture } from '../utils';
import { Artist, ArtistInfo } from '../../redux/types';

export const getSpotifyArtistInfo = async ({
  accessToken,
  spotifyId,
}: {
  accessToken: string;
  spotifyId: string;
}): Promise<ArtistInfo> => {
  spotifyApi.setAccessToken(accessToken);
  const response = await spotifyApi.getArtist(spotifyId);
  return {
    artist: {
      name: response.name,
      spotifyId: response.id,
      iconPicture: '',
      bigPicture: getBigPicture(response.images),
      popularity: response.popularity,
      genres: response.genres,
    },
    festivalsFuture: [],
    festivalsPast: [],
  };
};

export const getSpotifyArtistRelatedArtists = async ({
  accessToken,
  spotifyId,
}: {
  accessToken: string;
  spotifyId: string;
}): Promise<Artist[]> => {
  spotifyApi.setAccessToken(accessToken);
  const response = await spotifyApi.getArtistRelatedArtists(spotifyId);
  return response.artists.map((relArtist) => ({
    name: relArtist.name,
    spotifyId: relArtist.id,
    iconPicture: getIconPicture(relArtist.images),
    bigPicture: '',
    popularity: relArtist.popularity,
    genres: relArtist.genres,
  }));
};
