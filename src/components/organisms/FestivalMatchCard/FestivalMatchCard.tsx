import { useState, Fragment } from 'react';
import {
  Divider,
  Paper,
  Button,
  buttonClasses,
  Collapse,
  Typography,
  Box,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import ReactCountryFlag from 'react-country-flag';
import { FestivalMatch, Artist } from '../../../redux/types';
import {
  getMaxArtistsInWidth,
  displayedLocationName,
} from '../../../utils/utils';
import { StyledAvatarContainerdiv } from '../../molecules/ArtistBubble/ArtistBubble';
import HtmlTooltip from '../../atoms/HtmlTooltip';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import ExpandButton from '../../atoms/ExpandButton/ExpandButton';
import { ArtistBox } from '../../../layouts/StyledLayoutComponents';
import MatchingCircle from '../../atoms/MatchingCircle/MatchingCircle';
import ArtistBubble from '../../molecules/ArtistBubble/ArtistBubble';

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
  const themeMode = useTheme().palette.mode;

  const bigScreen = useMediaQuery('(min-width:690px)');
  const smallScreen = useMediaQuery('(max-width:439px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 7);
  const fillMatchingArtistWidth =
    maxArtistsInWidth - (matchingArtists.length % maxArtistsInWidth);
  const fillPopularArtistWidth =
    maxArtistsInWidth - (popularArtists.length % maxArtistsInWidth);

  const [expanded, setExpanded] = useState(false);

  const matchingPercentTotal = Math.ceil(festival.matching_percent_combined);
  const matchingPercentArtists = Math.ceil(festival.matching_percent_artists);
  const matchingPercentGenres = Math.ceil(festival.matching_percent_genres);

  const noLineupRegistered = popularArtists.length === 0;

  return (
    <Paper elevation={3} sx={{ pt: 1 }} key={festival.name}>
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
                {festival.name}
              </Typography>
            </StyledTitleButton>
            {festival.cancelled ? (
              <Typography variant="subtitle2" color="secondary">
                {`CANCELLED${
                  festival.date ? ` (${festival.date}, ${festival.year})` : ''
                }`}
              </Typography>
            ) : (
              <Typography variant="subtitle2">
                {festival.date + ', ' + festival.year}
              </Typography>
            )}
            <Typography variant="subtitle2">
              {displayedLocationName(festival.locationText)}
              <ReactCountryFlag
                countryCode={festival.country}
                svg
                style={{ marginLeft: '8px' }}
              />
            </Typography>
          </Box>
          {showMatching && (
            <HtmlTooltip
              placement="left-start"
              leaveTouchDelay={3000}
              title={
                <Fragment>
                  <Typography
                    color="inherit"
                    variant={bigScreen ? 'subtitle2' : 'body2'}
                  >
                    {`Genres: ${matchingPercentGenres}%`}
                  </Typography>
                  <Typography
                    color="inherit"
                    variant={bigScreen ? 'subtitle2' : 'body2'}
                  >
                    {`Artists: ${matchingPercentArtists}%`}
                  </Typography>
                  <Typography
                    color="inherit"
                    variant={bigScreen ? 'subtitle2' : 'body2'}
                  >
                    {`Total: ${matchingPercentTotal}%`}
                  </Typography>
                </Fragment>
              }
            >
              <MatchingCircle matchingPercent={matchingPercentTotal} />
            </HtmlTooltip>
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
          {'Genres: ' + festival.top_genres.slice(0, 3).join(', ')}
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
              ? 'Matching artists'
              : 'No matching artists'}
          </Typography>
        )}
      </StyledPaddedDiv>
      {showMatching && !noLineupRegistered && (
        <ArtistBox>
          {matchingArtists.map((artist) => (
            <ArtistBubble
              key={`avatar_match_artist_${festival.name}_${festival.year}_${artist.name}`}
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
            sx={{ my: 2, fontWeight: 700 }}
          >
            No lineup registered yet
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
              Popular artists at this festival
            </Typography>
          </Divider>
          <ArtistBox>
            {popularArtists.length > 0 &&
              popularArtists
                .slice(0, maxArtistsInWidth)
                .map((artist) => (
                  <ArtistBubble
                    key={`avatar_pop_artist_${festival.name}_${festival.year}_${artist.name}`}
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
                      key={`avatar_pop_artist_${festival.name}_${festival.year}_${artist.name}`}
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
