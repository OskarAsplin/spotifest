import {
  useElementScrollRestoration,
  useLayoutEffect,
} from '@tanstack/react-router';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';
import { useApiSuspenseQuery, withFallback } from '@src/api/api';
import {
  getDjangoAvailableContinents,
  ITEMS_PER_PAGE,
  postDjangoFestivalMatches,
  useDjangoPopularArtistsInLineupsInfiniteQuery,
} from '@src/api/djangoApi';
import {
  getAllArtistsFromSavedTracks,
  getAllPlaylistArtists,
  getAllTopArtistsWithPopularity,
} from '@src/api/spotifyApi';
import { Artist } from '@src/api/types';
import {
  SAVED_TRACKS_CHOICE,
  TOP_ARTISTS_CHOICE,
} from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { getIdFromMatchBasis } from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import { FestivalMatchCard } from '@src/components/organisms/FestivalMatchCard/FestivalMatchCard';
import { FestivalMatchCardSkeleton } from '@src/components/organisms/FestivalMatchCard/FestivalMatchCard.skeleton';
import {
  FestivalMatches,
  FestivalMatchesSkeleton,
  NoMatchResults,
} from '@src/components/templates/FestivalMatches/FestivalMatches';
import { ErrorFallback } from '@src/layouts/ErrorFallback';
import { getAreaFilters } from '@src/utils/areaUtils';
import { useMatchingStore } from '@src/zustand/matchingStore';
import { createMatchRequest } from './FestivalMatchesContainer.utils';
import { useMediaQuery } from '@src/hooks/useMediaQuery';
import {
  getMaxArtistsInFestivalMatchesWidth,
  useMeasure,
} from '@src/utils/displayUtils';

interface FestivalMatchesContainerProps {
  sharedMatchBasis?: string;
}

export const FestivalMatchesContainer =
  withFallback<FestivalMatchesContainerProps>(
    FestivalMatchesSkeleton,
    ErrorFallback,
  )(({ sharedMatchBasis }) => {
    const matchBasis =
      sharedMatchBasis ?? useMatchingStore((state) => state.matchBasis);

    if (!matchBasis) return null;

    const isTopArtists = matchBasis === TOP_ARTISTS_CHOICE;
    const isSavedTracks = matchBasis === SAVED_TRACKS_CHOICE;

    if (isTopArtists) return <FestivalMatchesWithTopArtists />;
    if (isSavedTracks) return <FestivalMatchesWithSavedTracks />;

    const { playlistId } = getIdFromMatchBasis(matchBasis);

    if (!playlistId) return null;

    return <FestivalMatchesWithPlaylistArtists playlistId={playlistId} />;
  });

const FestivalMatchesWithTopArtists = () => {
  const {
    data: { artists, weight },
  } = useApiSuspenseQuery(getAllTopArtistsWithPopularity);

  if (!artists.length || !weight) return <NoMatchResults />;

  return (
    <FestivalMatchesInnerContainer
      isTopArtists
      artists={artists}
      weight={weight}
    />
  );
};

const FestivalMatchesWithSavedTracks = () => {
  const {
    data: { artists, weight },
  } = useApiSuspenseQuery(getAllArtistsFromSavedTracks);

  if (!artists.length || !weight) return <NoMatchResults />;

  return <FestivalMatchesInnerContainer artists={artists} weight={weight} />;
};

interface FestivalMatchesWithPlaylistArtistsProps {
  playlistId: string;
}

const FestivalMatchesWithPlaylistArtists = ({
  playlistId,
}: FestivalMatchesWithPlaylistArtistsProps) => {
  const {
    data: { artists, weight },
  } = useApiSuspenseQuery(getAllPlaylistArtists, {
    params: { id: playlistId },
  });

  if (!artists.length || !weight) return <NoMatchResults />;

  return <FestivalMatchesInnerContainer artists={artists} weight={weight} />;
};

interface FestivalMatchesInnerContainerProps {
  artists: Artist[];
  weight: number;
  isTopArtists?: boolean;
}

const FestivalMatchesInnerContainer = ({
  artists,
  weight,
  isTopArtists,
}: FestivalMatchesInnerContainerProps) => {
  const matchArea = useMatchingStore((state) => state.matchArea);
  const fromDate = useMatchingStore((state) => state.fromDate);
  const toDate = useMatchingStore((state) => state.toDate);

  const { data: continents } = useApiSuspenseQuery(
    getDjangoAvailableContinents,
  );

  const { continentFilter, countryFilter, stateFilter } = getAreaFilters(
    continents,
    matchArea,
  );

  const matchRequest = createMatchRequest({
    artists,
    weight,
    isTopArtists,
    dateFrom: new Date(fromDate),
    dateTo: new Date(toDate),
    continents: continentFilter,
    countries: countryFilter,
    states: stateFilter,
  });

  const { data: festivalMatches } = useApiSuspenseQuery(
    postDjangoFestivalMatches,
    { params: matchRequest },
  );

  const allLineups = useMemo(
    () => festivalMatches.map((match) => match.lineup_id),
    [festivalMatches],
  );

  const {
    data: popularArtistsData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDjangoPopularArtistsInLineupsInfiniteQuery({
    allLineups,
  });

  const allPopularArtists = useMemo(
    () => (popularArtistsData ? popularArtistsData.pages.map((d) => d) : []),
    [popularArtistsData],
  );

  const numFestivalsWithPopularArtists = popularArtistsData
    ? popularArtistsData.pages.reduce(
        (acc, dict) => acc + Object.keys(dict).length,
        0,
      )
    : 0;

  const scrollEntry = useElementScrollRestoration({
    getElement: () => window,
  });

  const parentRef = useRef<HTMLDivElement | null>(null);

  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const scrollMargin = parentOffsetRef.current;

  const bigScreen = useMediaQuery('(min-width:640px)');

  const { getVirtualItems, getTotalSize, measureElement } =
    useWindowVirtualizer({
      count: festivalMatches.length,
      estimateSize: () => (bigScreen ? 532 : 484),
      overscan: 5,
      scrollMargin,
      initialOffset: scrollEntry?.scrollY,
    });

  useEffect(() => {
    const [lastItem] = [...getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= numFestivalsWithPopularArtists - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    festivalMatches.length,
    isFetchingNextPage,
    getVirtualItems(),
  ]);

  const [measureWidthRef, { width }] = useMeasure();
  const maxArtistsInWidth = getMaxArtistsInFestivalMatchesWidth(
    width,
    bigScreen,
  );

  return (
    <FestivalMatches
      ref={measureWidthRef}
      totalMatches={festivalMatches.length}
    >
      <div
        ref={parentRef}
        style={{
          height: `${getTotalSize()}px`,
          position: 'relative',
          overflowAnchor: 'none',
        }}
      >
        {getVirtualItems().map((virtualItem) => {
          const festival = festivalMatches[virtualItem.index];
          const isLoaderRow =
            virtualItem.index > numFestivalsWithPopularArtists - 1;

          if (isLoaderRow) {
            return (
              <div key={virtualItem.key} ref={measureElement}>
                <FestivalMatchCardSkeleton
                  key={festival.name}
                  maxArtistsInWidth={maxArtistsInWidth}
                />
              </div>
            );
          }

          const popularArtists =
            allPopularArtists[Math.floor(virtualItem.index / ITEMS_PER_PAGE)][
              festival.lineup_id
            ];

          const matchingArtists = artists
            .filter(
              (artist) =>
                artist.spotifyId &&
                festival.matching_artists.includes(artist.spotifyId),
            )
            .sort((a, b) => (a.userPopularity! < b.userPopularity! ? 1 : -1));

          return (
            <div
              key={`${festival.name}-${festival.year}`}
              ref={measureElement}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translateY(${virtualItem.start - scrollMargin}px)`,
                display: 'flex',
                width: '100%',
              }}
            >
              <FestivalMatchCard
                festival={festival}
                matchingArtists={matchingArtists}
                showMatching
                popularArtists={popularArtists}
                maxArtistsInWidth={maxArtistsInWidth}
              />
            </div>
          );
        })}
      </div>
    </FestivalMatches>
  );
};
