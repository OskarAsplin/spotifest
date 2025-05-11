import { useLayoutEffect } from '@tanstack/react-router';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';
import { useApiSuspenseQuery, withFallback } from '../api/api';
import {
  getDjangoAvailableContinents,
  ITEMS_PER_PAGE,
  postDjangoFestivalMatches,
  useDjangoPopularArtistsInLineupsInfiniteQuery,
} from '../api/djangoApi';
import {
  getAllArtistsFromSavedTracks,
  getAllPlaylistArtists,
  getAllTopArtistsWithPopularity,
} from '../api/spotifyApi';
import { Artist } from '../api/types';
import {
  SAVED_TRACKS_CHOICE,
  TOP_ARTISTS_CHOICE,
} from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { getIdFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchCard from '../components/organisms/FestivalMatchCard/FestivalMatchCard';
import FestivalMatchCardSkeleton from '../components/organisms/FestivalMatchCard/FestivalMatchCard.skeleton';
import FestivalMatches, {
  FestivalMatchesSkeleton,
  NoMatchResults,
} from '../components/templates/FestivalMatches/FestivalMatches';
import ErrorFallback from '../layouts/ErrorFallback';
import { getAreaFilters } from '../utils/areaUtils';
import { useMatchingStore } from '../zustand/matchingStore';
import { createMatchRequest } from './FestivalMatchesContainer.utils';

interface FestivalMatchesContainerProps {
  sharedMatchBasis?: string;
}

const FestivalMatchesContainer = withFallback<FestivalMatchesContainerProps>(
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

  const parentRef = useRef<HTMLDivElement | null>(null);

  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const scrollMargin = parentOffsetRef.current;

  const { getVirtualItems, getTotalSize, measureElement } =
    useWindowVirtualizer({
      count: festivalMatches.length,
      estimateSize: () => 700,
      overscan: 3,
      scrollMargin,
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

  return (
    <FestivalMatches totalMatches={festivalMatches.length}>
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
            return <FestivalMatchCardSkeleton key={festival.name} />;
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
              key={virtualItem.key}
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
                key={'FestivalMatchCard: ' + festival.name + festival.year}
                festival={festival}
                matchingArtists={matchingArtists}
                showMatching
                popularArtists={popularArtists}
              />
            </div>
          );
        })}
      </div>
    </FestivalMatches>
  );
};

export default FestivalMatchesContainer;
