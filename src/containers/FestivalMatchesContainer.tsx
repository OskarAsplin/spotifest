import {
  Box,
  Pagination,
  PaginationProps,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiQuery, withFallback } from '../api/api';
import {
  getDjangoAvailableContinents,
  postDjangoFestivalMatches,
  postDjangoPopularArtistsInLineups,
} from '../api/djangoApi';
import {
  getAllPlaylistArtists,
  getAllTopArtistsWithPopularity,
} from '../api/spotifyApi';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import { TOP_ARTISTS_CHOICE } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { getIdsFromMatchBasis } from '../components/molecules/MatchCriteriaSelect/MatchCriteriaSelect.utils';
import FestivalMatchCardContainer from '../containers/FestivalMatchCardContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { getAreaFilters } from '../utils/areaUtils';
import { useMatchingStore } from '../zustand/matchingStore';
import { createMatchRequest } from './FestivalMatchesContainer.utils';
import { OpReturn } from '../api/api.types';

const ITEMS_PER_PAGE = 15;

const SuspenseFallback = () => <CenteredLoadingSpinner />;

interface FestivalMatchesContainerProps {
  sharedMatchBasis?: string;
}

const FestivalMatchesContainer = withFallback<FestivalMatchesContainerProps>(
  SuspenseFallback,
  ErrorFallback,
)(({ sharedMatchBasis }) => {
  const { t } = useTranslation();
  const mediumOrBigScreen = useMediaQuery('(min-width:400px)');

  const [page, setPage] = useState(1);
  const matchBasis =
    sharedMatchBasis ?? useMatchingStore((state) => state.matchBasis);
  const matchArea = useMatchingStore((state) => state.matchArea);
  const fromDate = useMatchingStore((state) => state.fromDate);
  const toDate = useMatchingStore((state) => state.toDate);

  const { data: continents } = useApiQuery(getDjangoAvailableContinents);

  const { data: allTopArtistsData } = useApiQuery(
    getAllTopArtistsWithPopularity,
    { enabled: !sharedMatchBasis },
  );
  const topArtists = allTopArtistsData?.topArtists ?? [];
  const topArtistsCount = allTopArtistsData?.countTopArtists ?? 0;

  const { ownerId, playlistId } = getIdsFromMatchBasis(matchBasis);

  const { data: playlistArtistsData } = useApiQuery(getAllPlaylistArtists, {
    params: { ownerId, id: playlistId },
    enabled: !!ownerId && !!playlistId,
  });

  const playlistArtists = playlistArtistsData?.playlistArtists ?? [];
  const playlistNumTracks = playlistArtistsData?.numTracks ?? 0;

  const isTopArtists = matchBasis === TOP_ARTISTS_CHOICE;
  const artists = isTopArtists ? topArtists : playlistArtists;
  const numTracks = isTopArtists ? topArtistsCount : playlistNumTracks;

  const { continentFilter, countryFilter, stateFilter } = getAreaFilters(
    matchArea,
    continents,
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

  const { data: festivalMatches = [] } = useApiQuery(
    postDjangoFestivalMatches,
    {
      params: matchRequest,
      enabled: !!artists.length && !!numTracks,
    },
  );

  useEffect(() => {
    setPage(1);
  }, [festivalMatches]);

  const pageLineups = festivalMatches
    .slice((page - 1) * 15, page * 15)
    .map((match) => match.lineup_id);

  const { data: popularArtistsDict = {} } = useApiQuery<
    typeof postDjangoPopularArtistsInLineups
  >(postDjangoPopularArtistsInLineups, {
    params: { lineups: pageLineups },
    enabled: pageLineups.length > 0,
    placeholderData: keepPreviousData,
  });

  const numPages = Math.ceil(festivalMatches.length / ITEMS_PER_PAGE);

  const onPageChange = (
    event: React.ChangeEvent<unknown>,
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

  const showMatches = festivalMatches.slice(
    (page - 1) * ITEMS_PER_PAGE,
    Math.min(page * ITEMS_PER_PAGE, festivalMatches.length),
  );

  const isAnyMatch = showMatches.length > 0;

  const paginationProps: PaginationProps = {
    count: numPages,
    page: page,
    size: mediumOrBigScreen ? 'medium' : 'small',
    onChange: (event: React.ChangeEvent<unknown>, value: number) =>
      onPageChange(event, value, true),
  };

  const matchBasisArtists =
    matchBasis === TOP_ARTISTS_CHOICE ? topArtists : playlistArtists;

  return (
    <StyledMatchesRootBox>
      {showMatches.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            '@media (min-width: 610px)': { my: 1.5 },
            '@media (max-width: 609px)': { flexDirection: 'column', mb: 1 },
          }}
        >
          <StyledNumMatchesTypography variant="subtitle2">
            {festivalMatches.length + ' matches'}
          </StyledNumMatchesTypography>
          <StyledPaginationBox>
            <Pagination {...paginationProps} />
          </StyledPaginationBox>
        </Box>
      )}
      <Stack spacing={3}>
        {showMatches.map((festival) => {
          const popularArtists =
            festival.lineup_id in popularArtistsDict
              ? popularArtistsDict[festival.lineup_id]
              : [];
          const matchingArtists = matchBasisArtists
            .filter(
              (artist) =>
                artist.spotifyId &&
                festival.matching_artists.includes(artist.spotifyId),
            )
            .sort((a, b) => (a.userPopularity! < b.userPopularity! ? 1 : -1));
          return (
            <FestivalMatchCardContainer
              festival={festival}
              popularArtists={popularArtists}
              matchingArtists={matchingArtists}
              key={'FestivalMatchCard: ' + festival.name + festival.year}
              showMatching={true}
            />
          );
        })}
      </Stack>
      {showMatches.length > 0 && (
        <StyledPaginationBox sx={{ mt: 3, mb: 2 }}>
          <Pagination {...paginationProps} />
        </StyledPaginationBox>
      )}
      {!isAnyMatch && !!matchBasis && (
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'center', py: 2 }}
        >
          {t('matching.no_results')}
        </Typography>
      )}
    </StyledMatchesRootBox>
  );
});

export const StyledMatchesRootBox = styled(Box)(({ theme: { spacing } }) => ({
  width: '100%',
  maxWidth: '764px',
  '@media (max-width: 609px)': { marginTop: spacing(1) },
  '@media (min-width: 800px)': { marginTop: spacing(1) },
}));

const StyledPaginationBox = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));

const StyledNumMatchesTypography = styled(Typography)(
  ({ theme: { spacing } }) => ({
    '@media (min-width: 610px)': { position: 'absolute', textAlign: 'center' },
    '@media (max-width: 609px)': { marginBottom: spacing(1) },
  }),
);

export default FestivalMatchesContainer;
