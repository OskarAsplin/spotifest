import { PaginationProps } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useEffect, useState } from 'react';
import { useApiSuspenseQuery, withFallback } from '../api/api';
import {
  getDjangoAvailableContinents,
  postDjangoFestivalMatches,
} from '../api/djangoApi';
import {
  getAllPlaylistArtists,
  getAllTopArtistsWithPopularity,
} from '../api/spotifyApi';
import { Artist } from '../api/types';
import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { getIdsFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatches, {
  FestivalMatchesSkeleton,
  NoMatchResults,
} from '../components/templates/FestivalMatches/FestivalMatches';
import { FestivalMatchCardWithPopularArtists } from '../containers/FestivalMatchCardContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { getAreaFilters } from '../utils/areaUtils';
import { useMatchingStore } from '../zustand/matchingStore';
import { createMatchRequest } from './FestivalMatchesContainer.utils';

const ITEMS_PER_PAGE = 15;

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

  if (isTopArtists) return <FestivalMatchesWithTopArtists />;

  const { ownerId, playlistId } = getIdsFromMatchBasis(matchBasis);

  if (!ownerId || !playlistId) return null;

  return (
    <FestivalMatchesWithPlaylistArtists
      ownerId={ownerId}
      playlistId={playlistId}
    />
  );
});

const FestivalMatchesWithTopArtists = () => {
  const {
    data: { topArtists, countTopArtists },
  } = useApiSuspenseQuery(getAllTopArtistsWithPopularity);

  if (!topArtists.length || !countTopArtists) return <NoMatchResults />;

  return (
    <FestivalMatchesInnerContainer
      artists={topArtists}
      numTracks={countTopArtists}
    />
  );
};

interface FestivalMatchesWithPlaylistArtistsProps {
  ownerId: string;
  playlistId: string;
}

const FestivalMatchesWithPlaylistArtists = ({
  ownerId,
  playlistId,
}: FestivalMatchesWithPlaylistArtistsProps) => {
  const {
    data: { playlistArtists, numTracks },
  } = useApiSuspenseQuery(getAllPlaylistArtists, {
    params: { ownerId, id: playlistId },
  });

  if (!playlistArtists.length || !numTracks) return <NoMatchResults />;

  return (
    <FestivalMatchesInnerContainer
      artists={playlistArtists}
      numTracks={numTracks}
    />
  );
};

interface FestivalMatchesInnerContainerProps {
  artists: Artist[];
  numTracks: number;
  isTopArtists?: boolean;
}

const FestivalMatchesInnerContainer = ({
  artists,
  numTracks,
  isTopArtists,
}: FestivalMatchesInnerContainerProps) => {
  const mediumOrBigScreen = useMediaQuery('(min-width:400px)');

  const [page, setPage] = useState(1);
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
    numTracks,
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

  useEffect(() => {
    setPage(1);
  }, [festivalMatches]);

  const numPages = Math.ceil(festivalMatches.length / ITEMS_PER_PAGE);

  const onPageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
    isBottomPagination: boolean,
  ) => {
    if (page !== value) {
      setPage(value);
      if (isBottomPagination) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
      }
    }
  };

  const displayedMatches = festivalMatches.slice(
    (page - 1) * ITEMS_PER_PAGE,
    Math.min(page * ITEMS_PER_PAGE, festivalMatches.length),
  );

  const pageLineups = displayedMatches.map((match) => match.lineup_id);

  const paginationProps: PaginationProps = {
    count: numPages,
    page: page,
    size: mediumOrBigScreen ? 'medium' : 'small',
    onChange: (event: React.ChangeEvent<unknown>, value: number) =>
      onPageChange(event, value, true),
  };

  return (
    <FestivalMatches
      totalMatches={festivalMatches.length}
      paginationProps={paginationProps}
    >
      {displayedMatches.map((festival) => {
        const matchingArtists = artists
          .filter(
            (artist) =>
              artist.spotifyId &&
              festival.matching_artists.includes(artist.spotifyId),
          )
          .sort((a, b) => (a.userPopularity! < b.userPopularity! ? 1 : -1));
        return (
          <FestivalMatchCardWithPopularArtists
            festival={festival}
            pageLineups={pageLineups}
            matchingArtists={matchingArtists}
            key={'FestivalMatchCard: ' + festival.name + festival.year}
            showMatching
          />
        );
      })}
    </FestivalMatches>
  );
};

export default FestivalMatchesContainer;
