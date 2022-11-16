import { spotifyApi } from '../../redux/asyncActions';
import { Artist, ArtistInfo } from '../../redux/types';
import {
  mapSpotifyArtistToArtist,
  mapSpotifyArtistToArtistInfo,
} from './mappers';

export const getSpotifyArtistInfo = async ({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<ArtistInfo> =>
  mapSpotifyArtistToArtistInfo(await spotifyApi.getArtist(spotifyId));

export const getSpotifyArtistRelatedArtists = async ({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<Artist[]> =>
  (await spotifyApi.getArtistRelatedArtists(spotifyId)).artists.map(
    mapSpotifyArtistToArtist
  );
