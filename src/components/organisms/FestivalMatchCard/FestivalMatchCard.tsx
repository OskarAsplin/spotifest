import {
  Box,
  Collapse,
  Divider,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from '@tanstack/react-router';
import { memo, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { Artist, FestivalMatch } from '@src/api/types';
import { ArtistBox } from '@src/layouts/StyledLayoutComponents';
import { getCancelledDateString } from '@src/utils/dateUtils';
import {
  displayedLocationName,
  getMaxArtistsInWidth,
} from '@src/utils/displayUtils';
import ExpandButton from '@src/components/atoms/ExpandButton/ExpandButton';
import ArtistBubble, {
  StyledAvatarContainerDiv,
} from '@src/components/molecules/ArtistBubble/ArtistBubble';
import MatchingCircleWithTooltip from '@src/components/molecules/MatchingCircleWithTooltip/MatchingCircleWithTooltip';
import { StyledPaddedDiv, StyledTitleButton } from './FestivalMatchCard.styled';
import isEqual from 'lodash-es/isEqual';

export interface FestivalMatchCardProps {
  festival: FestivalMatch;
  popularArtists: Artist[];
  matchingArtists?: Artist[];
  showMatching?: boolean;
}

const FestivalMatchCard = memo(
  ({
    festival,
    showMatching,
    popularArtists,
    matchingArtists = [],
  }: FestivalMatchCardProps) => {
    const {
      name,
      locationText,
      country,
      date,
      year,
      cancelled,
      matching_percent_artists,
      matching_percent_genres,
      matching_percent_combined,
      top_genres,
    } = festival;
    const themeMode = useTheme().palette.mode;
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const bigScreen = useMediaQuery('(min-width:690px)');
    const smallScreen = useMediaQuery('(max-width:439px)');

    const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 7);
    const fillMatchingArtistWidth =
      maxArtistsInWidth - (matchingArtists.length % maxArtistsInWidth);
    const fillPopularArtistWidth =
      maxArtistsInWidth - (popularArtists.length % maxArtistsInWidth);

    const noLineupRegistered = popularArtists.length === 0;

    return (
      <Paper elevation={3} sx={{ pt: 1, mb: 3, width: '100%' }} key={name}>
        {showMatching && <Box sx={{ pb: 1 }} />}
        <StyledPaddedDiv>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                ...(showMatching
                  ? {}
                  : {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                    }),
              }}
            >
              <Link
                to="/festival/$festivalId"
                params={{ festivalId: encodeURIComponent(festival.name) }}
                style={{ color: 'inherit' }}
              >
                <StyledTitleButton color="inherit" variant="outlined">
                  <Typography
                    variant={bigScreen ? 'h3' : 'h5'}
                    sx={{
                      wordWrap: 'break-word',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {name}
                  </Typography>
                </StyledTitleButton>
              </Link>
              {cancelled ? (
                <Typography variant="subtitle2" color="secondary">
                  {getCancelledDateString(date, year)}
                </Typography>
              ) : (
                <Typography variant="subtitle2">
                  {date + ', ' + year}
                </Typography>
              )}
              <Typography variant="subtitle2">
                {displayedLocationName(locationText)}
                <ReactCountryFlag
                  countryCode={country}
                  svg
                  style={{ marginLeft: '8px' }}
                />
              </Typography>
            </Box>
            {showMatching && (
              <MatchingCircleWithTooltip
                total={Math.ceil(matching_percent_combined)}
                artists={Math.ceil(matching_percent_artists)}
                genres={Math.ceil(matching_percent_genres)}
              />
            )}
          </Box>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: showMatching ? undefined : 'center',
            }}
          >
            {`${t('common.genres')}: ${top_genres}`}
          </Typography>
          {showMatching && !noLineupRegistered && (
            <Typography
              variant="body1"
              color={matchingArtists.length > 0 ? 'primary' : 'textDisabled'}
              sx={{ my: 1.5, fontWeight: 700 }}
            >
              {matchingArtists.length > 0
                ? t('matching.card.matching_artists')
                : t('matching.card.no_matching_artists')}
            </Typography>
          )}
        </StyledPaddedDiv>
        {showMatching && !noLineupRegistered && (
          <ArtistBox>
            {matchingArtists.map((artist) => (
              <ArtistBubble
                key={`avatar_match_artist_${name}_${year}_${artist.name}`}
                artist={artist}
              />
            ))}
            {matchingArtists.length > 0 &&
              Array.from({ length: fillMatchingArtistWidth }, (_, i) => (
                <StyledAvatarContainerDiv key={i} />
              ))}
          </ArtistBox>
        )}
        {noLineupRegistered ? (
          <StyledPaddedDiv>
            <Typography
              variant="body1"
              color="textDisabled"
              sx={{ py: 2, fontWeight: 700 }}
            >
              {t('common.no_lineup')}
            </Typography>
          </StyledPaddedDiv>
        ) : (
          <>
            <Divider sx={{ width: '100%' }}>
              <Typography
                variant="body1"
                color="primary"
                sx={{ my: 1.5, fontWeight: 700 }}
                onClick={() => setExpanded(!expanded)}
              >
                {t('matching.card.popular_artists')}
              </Typography>
            </Divider>
            <ArtistBox>
              {popularArtists.length > 0 &&
                popularArtists
                  .slice(0, maxArtistsInWidth)
                  .map((artist) => (
                    <ArtistBubble
                      key={`avatar_pop_artist_${name}_${year}_${artist.name}`}
                      artist={artist}
                    />
                  ))}
              {popularArtists.length > 0 &&
                Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                  <StyledAvatarContainerDiv key={i} />
                ))}
            </ArtistBox>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <ArtistBox>
                {popularArtists.length > 0 &&
                  popularArtists
                    .slice(
                      maxArtistsInWidth,
                      maxArtistsInWidth > 4
                        ? maxArtistsInWidth * 2
                        : maxArtistsInWidth * 3,
                    )
                    .map((artist) => (
                      <ArtistBubble
                        key={`avatar_pop_artist_${name}_${year}_${artist.name}`}
                        artist={artist}
                      />
                    ))}
                {popularArtists.length > 0 &&
                  Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                    <StyledAvatarContainerDiv key={i} />
                  ))}
              </ArtistBox>
            </Collapse>
            {popularArtists.length > maxArtistsInWidth && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  background:
                    themeMode === 'dark' && !expanded
                      ? 'linear-gradient(#313131, #404040)'
                      : undefined,
                  borderRadius: 'inherit',
                }}
              >
                <ExpandButton
                  expanded={expanded}
                  onClick={() => setExpanded(!expanded)}
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);

export default FestivalMatchCard;
