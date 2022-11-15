import { fetchGet, getApiBaseUrl } from './restUtils';
import { ArtistInfo } from '../../redux/types';

const getOntourBase = () => `${getApiBaseUrl()}/onTour`;

export const getDjangoArtistBySpotifyId = ({
  spotifyId,
}: {
  spotifyId: string;
}): Promise<ArtistInfo> =>
  fetchGet<ArtistInfo>(`${getOntourBase()}/artistInfo/?spotifyId=${spotifyId}`);

export const getDjangoArtistByName = ({
  name,
}: {
  name: string;
}): Promise<ArtistInfo> =>
  fetchGet<ArtistInfo>(
    `${getOntourBase()}/artistInfo/?q=${encodeURIComponent(name)}`
  );
