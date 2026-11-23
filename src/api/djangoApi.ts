import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGet, fetchPost, HttpError } from './restUtils';
import {
  Area,
  ArtistInfo,
  FestivalInfo,
  FestivalMatch,
  MatchRequest,
  PopularArtistsDict,
  SearchResponse,
} from './types';
import { getKey } from './api';

export const ITEMS_PER_PAGE = 15;

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

export const useDjangoPopularArtistsInLineupsInfiniteQuery = ({
  allLineups,
}: {
  allLineups: string[];
}) =>
  useInfiniteQuery({
    queryKey: getKey(getDjangoPopularArtistsInfiniteQuery, { allLineups }),
    queryFn: getDjangoPopularArtistsInfiniteQuery({ allLineups }),
    getNextPageParam: (_lastPage, pages) =>
      pages.length * ITEMS_PER_PAGE < allLineups.length
        ? pages.length + 1
        : undefined,
    initialPageParam: 1,
    retry: (failureCount, error) =>
      error instanceof HttpError && error.status === 429 && failureCount < 3,
    retryDelay: (attempt) => 2000 * 2 ** attempt,
  });

const POPULAR_ARTISTS_MIN_INTERVAL_MS = 500;
let lastPopularArtistsRequestAt = 0;

const waitForPopularArtistsThrottle = async () => {
  const wait =
    lastPopularArtistsRequestAt + POPULAR_ARTISTS_MIN_INTERVAL_MS - Date.now();
  lastPopularArtistsRequestAt = Date.now() + Math.max(wait, 0);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
};

const getDjangoPopularArtistsInfiniteQuery =
  ({ allLineups }: { allLineups: string[] }) =>
  async ({ pageParam }: { pageParam: number }) => {
    const lineups = allLineups.slice(
      (pageParam - 1) * ITEMS_PER_PAGE,
      Math.min(pageParam * ITEMS_PER_PAGE, allLineups.length),
    );

    await waitForPopularArtistsThrottle();
    return postDjangoPopularArtistsInLineups({ lineups });
  };
