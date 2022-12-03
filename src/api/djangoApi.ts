import { fetchGet, fetchPost, getApiBaseUrl } from './restUtils';
import {
  Area,
  ArtistInfo,
  FestivalInfo,
  FestivalMatch,
  MatchRequest,
  PopularArtistsDict,
  SearchResponse,
} from './types';

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

export function getDjangoAvailableCountries() {
  const url = `${getOntourBase()}/availableCountries`;
  return fetchGet<Area[]>(url);
}

export function getDjangoAvailableContinents() {
  const url = `${getOntourBase()}/availableContinents`;
  return fetchGet<Area[]>(url);
}

export function postDjangoFestivalMatches(matchRequest: MatchRequest) {
  const url = `${getOntourBase()}/festivalMatches`;
  return fetchPost<FestivalMatch[]>(url, JSON.stringify(matchRequest));
}

export function postDjangoPopularArtistsInLineups({
  lineups,
}: {
  lineups: string[];
}) {
  const url = `${getOntourBase()}/popularArtistsInLineups`;
  return fetchPost<PopularArtistsDict>(url, JSON.stringify(lineups));
}
