import { useEffect, useState } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import Pagination from '@mui/material/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { getPopularArtistsInLineups } from '../redux/asyncActions';
import {
  selectFestivalMatches,
  selectPopularArtists,
  selectMatchSettings,
  selectSelectedPlaylistArtists,
  selectCurrentPage,
  setCurrentPage,
} from '../redux/reducers/festivalMatchingSlice';
import { selectTopArtists } from '../redux/reducers/spotifyAccountSlice';
import {
  FestivalMatch,
  Artist,
  PopularArtistsDict,
  MatchSettings,
} from '../redux/types';
import FestivalMatchCard from './FestivalMatchCard';
import { styled } from '@mui/material/styles';

const FestivalMatchesDisplay = () => {
  const festivalMatches: FestivalMatch[] = useSelector(selectFestivalMatches);
  const popularArtistsDict: PopularArtistsDict =
    useSelector(selectPopularArtists);
  const matchSettings: MatchSettings = useSelector(selectMatchSettings);
  const topArtists: Artist[] = useSelector(selectTopArtists);
  const selectedPlaylistArtists: Artist[] = useSelector(
    selectSelectedPlaylistArtists
  );
  const currentPage: number = useSelector(selectCurrentPage);
  const dispatch = useDispatch();

  const mediumOrBigScreen = useMediaQuery('(min-width:400px)');

  const [siteInitialized, setSiteInitialized] = useState(false);
  const [isAnyMatch, setIsAnyMatch] = useState(true);

  const itemsPerPage = 15;
  const numPages = Math.ceil(festivalMatches.length / itemsPerPage);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
    isBottomPagination: boolean
  ) => {
    if (currentPage !== value) {
      dispatch(setCurrentPage(value));
      const currentPageLineups = festivalMatches
        .slice((value - 1) * 15, value * 15)
        .map((match) => match.lineup_id);
      if (currentPageLineups.length > 0) {
        dispatch(getPopularArtistsInLineups(currentPageLineups));
      }
      if (isBottomPagination) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
      }
    }
  };

  const showMatches = festivalMatches.slice(
    (currentPage - 1) * itemsPerPage,
    Math.min(currentPage * itemsPerPage, festivalMatches.length)
  );

  useEffect(() => {
    if (showMatches.length === 0) {
      setIsAnyMatch(false);
    } else {
      setIsAnyMatch(true);
      setSiteInitialized(true);
    }
  }, [showMatches]);

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
        {showMatches.map((festival: FestivalMatch) => {
          const popularArtists =
            festival.lineup_id in popularArtistsDict
              ? popularArtistsDict[festival.lineup_id]
              : [];
          const matchingArtists =
            matchSettings.matchBasis === '__your__top__artists__'
              ? topArtists
                  .filter(
                    (artist) =>
                      artist.spotifyId &&
                      festival.matching_artists.includes(artist.spotifyId)
                  )
                  .sort((a, b) =>
                    a.userPopularity! < b.userPopularity! ? 1 : -1
                  )
              : selectedPlaylistArtists
                  .filter(
                    (artist) =>
                      artist.spotifyId &&
                      festival.matching_artists.includes(artist.spotifyId)
                  )
                  .sort((a, b) =>
                    a.userPopularity! < b.userPopularity! ? 1 : -1
                  );
          return (
            <FestivalMatchCard
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
      {siteInitialized && !isAnyMatch && (
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'center', py: 2 }}
        >
          No registered festivals in the selected area in this time frame.
        </Typography>
      )}
    </StyledRootBox>
  );
};

const StyledRootBox = styled(Box)(({ theme: { spacing } }) => {
  return {
    '@media (max-width: 609px)': {
      marginTop: spacing(1),
    },
    '@media (min-width: 800px)': {
      marginTop: spacing(1),
    },
    width: '100%',
    maxWidth: '764px',
  };
});

const StyledPaginationBox = styled(Box)(() => {
  return {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  };
});

const StyledNumMatchesTypography = styled(Typography)(
  ({ theme: { spacing } }) => {
    return {
      '@media (min-width: 610px)': {
        position: 'absolute',
        textAlign: 'center',
      },
      '@media (max-width: 609px)': { marginBottom: spacing(1) },
    };
  }
);

export default FestivalMatchesDisplay;
