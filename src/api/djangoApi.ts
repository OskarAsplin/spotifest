import { queryOptions } from '@tanstack/react-query';
import { fetchGet, fetchPost, HttpError } from './restUtils';
import {
  Area,
  Artist,
  ArtistInfo,
  FestivalInfo,
  FestivalMatch,
  MatchRequest,
  PopularArtistsDict,
  SearchResponse,
} from './types';
import { getKey } from './api';

const ontourBaseUrl = `${import.meta.env.VITE_BACKEND_URL}/onTour`;

export const getDjangoArtistBySpotifyId = ({
  spotifyId,
}: {
  spotifyId: string;
}) => {
  const url = `${ontourBaseUrl}/artistInfo/?spotifyId=${spotifyId}`;
  return fetchGet<ArtistInfo>(url);
};

export const getDjangoArtistByName = ({ name }: { name: string }) => {
  const url = `${ontourBaseUrl}/artistInfo/?q=${encodeURIComponent(name)}`;
  return fetchGet<ArtistInfo>(url);
};

export const getDjangoFestival = ({ name }: { name: string }) => {
  const url = `${ontourBaseUrl}/festivalInfo/?q=${encodeURIComponent(name)}`;
  return fetchGet<FestivalInfo>(url);
};

export const getDjangoSearchResults = ({ search }: { search: string }) => {
  const url = `${ontourBaseUrl}/search/?q=${encodeURIComponent(search)}`;
  return fetchGet<SearchResponse>(url);
};

export const getDjangoAvailableCountries = () => {
  const url = `${ontourBaseUrl}/availableCountries`;
  return fetchGet<Area[]>(url);
};

export const getDjangoAvailableContinents = () => {
  const url = `${ontourBaseUrl}/availableContinents`;
  return fetchGet<Area[]>(url);
};

export const postDjangoFestivalMatches = (matchRequest: MatchRequest) => {
  const url = `${ontourBaseUrl}/festivalMatches`;
  return fetchPost<FestivalMatch[]>(url, JSON.stringify(matchRequest));
};

const postDjangoPopularArtistsInLineups = ({
  lineups,
}: {
  lineups: string[];
}) => {
  const url = `${ontourBaseUrl}/popularArtistsInLineups`;
  return fetchPost<PopularArtistsDict>(url, JSON.stringify(lineups));
};

const POPULAR_ARTISTS_MIN_INTERVAL_MS = 500;
const POPULAR_ARTISTS_MAX_BATCH_SIZE = 30;
let lastPopularArtistsRequestAt = 0;

const waitForPopularArtistsThrottle = async () => {
  const wait =
    lastPopularArtistsRequestAt + POPULAR_ARTISTS_MIN_INTERVAL_MS - Date.now();
  lastPopularArtistsRequestAt = Date.now() + Math.max(wait, 0);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
};

interface PendingPopularArtistsRequest {
  resolve: (artists: Artist[]) => void;
  reject: (error: unknown) => void;
}

let pendingPopularArtists = new Map<string, PendingPopularArtistsRequest[]>();
let isPopularArtistsFlushScheduled = false;

const sendPopularArtistsBatch = async (
  batch: Map<string, PendingPopularArtistsRequest[]>,
  lineups: string[],
) => {
  await waitForPopularArtistsThrottle();
  try {
    const popularArtists = await postDjangoPopularArtistsInLineups({ lineups });
    lineups.forEach((lineupId) =>
      batch
        .get(lineupId)
        ?.forEach(({ resolve }) => resolve(popularArtists[lineupId] ?? [])),
    );
  } catch (error) {
    lineups.forEach((lineupId) =>
      batch.get(lineupId)?.forEach(({ reject }) => reject(error)),
    );
  }
};

const flushPopularArtists = async () => {
  isPopularArtistsFlushScheduled = false;
  const batch = pendingPopularArtists;
  pendingPopularArtists = new Map();

  const lineupIds = [...batch.keys()];
  for (let i = 0; i < lineupIds.length; i += POPULAR_ARTISTS_MAX_BATCH_SIZE) {
    await sendPopularArtistsBatch(
      batch,
      lineupIds.slice(i, i + POPULAR_ARTISTS_MAX_BATCH_SIZE),
    );
  }
};

const loadPopularArtists = ({ lineupId }: { lineupId: string }) =>
  new Promise<Artist[]>((resolve, reject) => {
    const pending = pendingPopularArtists.get(lineupId) ?? [];
    pendingPopularArtists.set(lineupId, [...pending, { resolve, reject }]);

    if (!isPopularArtistsFlushScheduled) {
      isPopularArtistsFlushScheduled = true;
      setTimeout(() => void flushPopularArtists(), 0);
    }
  });

export const popularArtistsQueryOptions = (lineupId: string) =>
  queryOptions({
    queryKey: getKey(loadPopularArtists, { lineupId }),
    queryFn: () => loadPopularArtists({ lineupId }),
    retry: (failureCount, error) =>
      error instanceof HttpError && error.status === 429 && failureCount < 3,
    retryDelay: (attempt) => 2000 * 2 ** attempt,
  });
