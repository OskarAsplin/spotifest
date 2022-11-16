import { fetchGet, getApiBaseUrl } from './restUtils';
import { ArtistInfo, FestivalInfo, SearchResponse } from '../../redux/types';

const getOntourBase = () => `${getApiBaseUrl()}/onTour`;

export function getDjangoArtistBySpotifyId({
  spotifyId,
}: {
  spotifyId: string;
}) {
  const url = `${getOntourBase()}/artistInfo/?spotifyId=${spotifyId}`;
  return fetchGet<ArtistInfo>(url);
}

export function getDjangoArtistByName({ name }: { name: string }) {
  const url = `${getOntourBase()}/artistInfo/?q=${encodeURIComponent(name)}`;
  return fetchGet<ArtistInfo>(url);
}

export function getDjangoFestival({ name }: { name: string }) {
  const url = `${getOntourBase()}/festivalInfo/?q=${encodeURIComponent(name)}`;
  return fetchGet<FestivalInfo>(url);
}

export function getDjangoSearchResults({ search }: { search: string }) {
  const url = `${getOntourBase()}/search/?q=${encodeURIComponent(search)}`;
  return fetchGet<SearchResponse>(url);
}
