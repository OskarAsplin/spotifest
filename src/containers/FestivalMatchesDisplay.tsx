import { Typography, Box, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import Pagination from '@mui/material/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentPage,
  setCurrentPage,
} from '../redux/reducers/festivalMatchingSlice';
import FestivalMatchCardContainer from '../containers/FestivalMatchCardContainer';
import { styled } from '@mui/material/styles';
import { useGet, withFallback } from '../utils/api/api';
import {
  getDjangoAvailableContinents,
  postDjangoFestivalMatches,
  postDjangoPopularArtistsInLineups,
} from '../utils/api/djangoApi';
import {
  selectFromDate,
  selectMatchArea,
  selectMatchBasis,
  selectToDate,
} from '../redux/reducers/matchingSlice';
import { TOP_ARTISTS_CHOICE } from '../components/MatchCriteriaSelect/MatchCriteriaSelect';
import { createMatchRequest } from './FestivalMatchesDisplay.utils';
import {
  getAllPlaylistArtists,
  getAllPlaylists,
  getAllTopArtistsWithPopularity,
  getSpotifyUserInfo,
} from '../utils/api/spotifyApi';
import { getAreaFilters } from '../utils/utils';
import { CenteredLoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';

const ITEMS_PER_PAGE = 15;

const SuspenseFallback = () => <CenteredLoadingSpinner show />;

const FestivalMatchesDisplay = withFallback(SuspenseFallback)(() => {
  const mediumOrBigScreen = useMediaQuery('(min-width:400px)');
  const dispatch = useDispatch();

  const currentPage = useSelector(selectCurrentPage);
  const matchBasis = useSelector(selectMatchBasis);
  const matchArea = useSelector(selectMatchArea);
  const fromDate = useSelector(selectFromDate);
  const toDate = useSelector(selectToDate);

  const { data: continents } = useGet(getDjangoAvailableContinents);

  const { data: allTopArtistsData } = useGet(getAllTopArtistsWithPopularity);
  const topArtists = allTopArtistsData?.topArtists ?? [];
  const topArtistsCount = allTopArtistsData?.countTopArtists ?? 0;

  const { data: userInfo } = useGet(getSpotifyUserInfo);
  const { data: playlists } = useGet(getAllPlaylists, {
    query: { userId: userInfo?.id ?? '' },
    enabled: !!userInfo?.id,
  });

  const playlist = playlists?.find(({ name }) => name === matchBasis);

  const { data: playlistArtistsData } = useGet(getAllPlaylistArtists, {
    query: { playlist },
    enabled: !!playlist,
  });

  const playlistArtists = playlistArtistsData?.playlistArtists ?? [];
  const playlistNumTracks = playlistArtistsData?.numTracks ?? 0;

  const isTopArtists = matchBasis === TOP_ARTISTS_CHOICE;
  const artists = isTopArtists ? topArtists : playlistArtists;
  const numTracks = isTopArtists ? topArtistsCount : playlistNumTracks;

  const { continentFilter, countryFilter, stateFilter } = getAreaFilters(
    matchArea,
    continents
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

  const { data: festivalMatches = [] } = useGet(postDjangoFestivalMatches, {
    query: matchRequest,
    enabled: !!artists.length && !!numTracks,
  });

  const currentPageLineups = festivalMatches
    .slice((currentPage - 1) * 15, currentPage * 15)
    .map((match) => match.lineup_id);

  const { data: popularArtistsDict = {} } = useGet(
    postDjangoPopularArtistsInLineups,
    {
      query: { lineups: currentPageLineups },
      enabled: currentPageLineups.length > 0,
      keepPreviousData: true,
    }
  );

  const numPages = Math.ceil(festivalMatches.length / ITEMS_PER_PAGE);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
    isBottomPagination: boolean
  ) => {
    if (currentPage !== value) {
      dispatch(setCurrentPage(value));
      if (isBottomPagination) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
      }
    }
  };

  const showMatches = festivalMatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    Math.min(currentPage * ITEMS_PER_PAGE, festivalMatches.length)
  );

  const isAnyMatch = showMatches.length > 0;

  return (
    <StyledRootBox>
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
            <Pagination
              count={numPages}
              page={currentPage}
              size={mediumOrBigScreen ? 'medium' : 'small'}
              onChange={(event: React.ChangeEvent<unknown>, value: number) =>
                handleChange(event, value, false)
              }
            />
          </StyledPaginationBox>
        </Box>
      )}
      <Stack spacing={3}>
        {showMatches.map((festival) => {
          const popularArtists =
            festival.lineup_id in popularArtistsDict
              ? popularArtistsDict[festival.lineup_id]
              : [];
          const matchingArtists =
            matchBasis === TOP_ARTISTS_CHOICE
              ? topArtists
                  .filter(
                    (artist) =>
                      artist.spotifyId &&
                      festival.matching_artists.includes(artist.spotifyId)
                  )
                  .sort((a, b) =>
                    a.userPopularity! < b.userPopularity! ? 1 : -1
                  )
              : playlistArtists
                  .filter(
                    (artist) =>
                      artist.spotifyId &&
                      festival.matching_artists.includes(artist.spotifyId)
                  )
                  .sort((a, b) =>
                    a.userPopularity! < b.userPopularity! ? 1 : -1
                  );
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
          <Pagination
            count={numPages}
            page={currentPage}
            size={mediumOrBigScreen ? 'medium' : 'small'}
            onChange={(event: React.ChangeEvent<unknown>, value: number) =>
              handleChange(event, value, true)
            }
          />
        </StyledPaginationBox>
      )}
      {!isAnyMatch && !!matchBasis && (
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'center', py: 2 }}
        >
          No registered festivals in the selected area in this time frame.
        </Typography>
      )}
    </StyledRootBox>
  );
});

const StyledRootBox = styled(Box)(({ theme: { spacing } }) => ({
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
  })
);

export default FestivalMatchesDisplay;
