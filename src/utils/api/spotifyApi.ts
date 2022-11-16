import { spotifyApi } from '../../redux/asyncActions';
import { Artist, ArtistInfo } from '../../redux/types';
import {
  mapSpotifyArtistToArtist,
  mapSpotifyArtistToArtistInfo,
} from './mappers';

export async function getSpotifyArtistInfo({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<ArtistInfo> {
  return mapSpotifyArtistToArtistInfo(await spotifyApi.getArtist(spotifyId));
}

export async function getSpotifyArtistRelatedArtists({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<Artist[]> {
  return (await spotifyApi.getArtistRelatedArtists(spotifyId)).artists.map(
    mapSpotifyArtistToArtist
  );
}
