import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGet, fetchPost } from './restUtils';
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

export const postDjangoPopularArtistsInLineups = ({
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
  });

const getDjangoPopularArtistsInfiniteQuery =
  ({ allLineups }: { allLineups: string[] }) =>
  ({ pageParam }: { pageParam: number }) => {
    const lineups = allLineups.slice(
      (pageParam - 1) * ITEMS_PER_PAGE,
      Math.min(pageParam * ITEMS_PER_PAGE, allLineups.length),
    );

    return postDjangoPopularArtistsInLineups({ lineups });
  };
