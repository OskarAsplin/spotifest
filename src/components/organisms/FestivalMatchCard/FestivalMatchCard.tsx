import {
  Box,
  Button,
  buttonClasses,
  Collapse,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { Artist, FestivalMatch } from '../../../api/types';
import { ArtistBox } from '../../../layouts/StyledLayoutComponents';
import { getCancelledDateString } from '../../../utils/dateUtils';
import {
  displayedLocationName,
  getMaxArtistsInWidth,
} from '../../../utils/displayUtils';
import ExpandButton from '../../atoms/ExpandButton/ExpandButton';
import ArtistBubble, {
  StyledAvatarContainerdiv,
} from '../../molecules/ArtistBubble/ArtistBubble';
import MatchingCircleWithTooltip from '../../molecules/MatchingCircleWithTooltip/MatchingCircleWithTooltip';

export interface FestivalMatchCardProps {
  festival: FestivalMatch;
  popularArtists: Artist[];
  matchingArtists: Artist[];
  showMatching: boolean;
  onClickTitle: () => void;
  onClickArtistBubble: (artistName: string, spotifyId?: string) => void;
}

const FestivalMatchCard = ({
  festival,
  showMatching,
  popularArtists,
  matchingArtists,
  onClickTitle,
  onClickArtistBubble,
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
    <Paper elevation={3} sx={{ pt: 1 }} key={name}>
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
            <StyledTitleButton
              color="inherit"
              variant="outlined"
              onClick={onClickTitle}
            >
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
            {cancelled ? (
              <Typography variant="subtitle2" color="secondary">
                {getCancelledDateString(date, year)}
              </Typography>
            ) : (
              <Typography variant="subtitle2">{date + ', ' + year}</Typography>
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
          {`${t('common.genres')}: ${top_genres.slice(0, 3).join(', ')}`}
        </Typography>
        {showMatching && !noLineupRegistered && (
          <Typography
            variant="body1"
            color={
              matchingArtists.length > 0
                ? 'primary'
                : ({ palette }) => palette.text.disabled
            }
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
              onClick={() => onClickArtistBubble(artist.name, artist.spotifyId)}
            />
          ))}
          {matchingArtists.length > 0 &&
            Array.from({ length: fillMatchingArtistWidth }, (_, i) => (
              <StyledAvatarContainerdiv key={i} />
            ))}
        </ArtistBox>
      )}
      {noLineupRegistered ? (
        <StyledPaddedDiv>
          <Typography
            variant="body1"
            color={({ palette }) => palette.text.disabled}
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
                    onClick={() =>
                      onClickArtistBubble(artist.name, artist.spotifyId)
                    }
                  />
                ))}
            {popularArtists.length > 0 &&
              Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                <StyledAvatarContainerdiv key={i} />
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
                      : maxArtistsInWidth * 3
                  )
                  .map((artist) => (
                    <ArtistBubble
                      key={`avatar_pop_artist_${name}_${year}_${artist.name}`}
                      artist={artist}
                      onClick={() =>
                        onClickArtistBubble(artist.name, artist.spotifyId)
                      }
                    />
                  ))}
              {popularArtists.length > 0 &&
                Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                  <StyledAvatarContainerdiv key={i} />
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
};

const StyledTitleButton = styled(Button)(({ theme: { spacing, palette } }) => ({
  [`&.${buttonClasses.root}`]: {
    whiteSpace: 'normal',
    textTransform: 'none',
    textAlign: 'left',
    marginBottom: spacing(1.5),
    padding: spacing(0, 1),
    borderColor: palette.primary?.[palette.mode],
    '@media (min-width: 690px)': { borderStyle: 'dashed' },
    '@media (max-width: 689px)': { borderStyle: 'dotted' },
  },
}));

const StyledPaddedDiv = styled('div')(({ theme: { spacing } }) => ({
  '@media (min-width: 690px)': { padding: spacing(0, 4) },
  '@media (max-width: 689px)': {
    '@media (min-width: 440px)': { padding: spacing(0, 2) },
  },
  '@media (max-width: 439px)': { padding: spacing(0, 2) },
}));

export default FestivalMatchCard;
