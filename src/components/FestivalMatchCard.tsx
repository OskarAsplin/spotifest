import { useState, Fragment } from 'react';
import {
  Divider,
  Theme,
  Paper,
  IconButton,
  Button,
  buttonClasses,
  Collapse,
  Typography,
  Box,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate } from 'react-router-dom';
import { FestivalMatch, Artist } from '../redux/types';
import { getMaxArtistsInWidth, displayedLocationName } from '../utils/utils';
import ArtistBubble, { StyledAvatarContainerdiv } from './ArtistBubble';
import HtmlTooltip from './HtmlTooltip';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles(({ spacing, transitions }: Theme) =>
  createStyles({
    artistAvatarBox: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      '@media (min-width: 440px)': {
        padding: spacing(0, 2, 0, 2),
      },
      '@media (max-width: 439px)': {
        padding: spacing(0, 1, 0, 1),
      },
    },
    titleAndMatchBox: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    matchingPopularBox: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      minHeight: '48px',
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: transitions.create('transform', {
        duration: transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    lineup: {
      maxHeight: 260,
      maxWidth: '100%',
    },
    lineupImgButton: {
      padding: '0px',
      borderRadius: '0px',
    },
    flexRow: {
      display: 'flex',
      '@media (min-width: 690px)': {
        marginTop: spacing(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      '@media (max-width: 689px)': {
        flexDirection: 'column',
      },
    },
    paddingBottom: {
      paddingBottom: spacing(1),
    },
  })
);

interface Props {
  festival: FestivalMatch;
  popularArtists: Artist[];
  matchingArtists: Artist[];
  showMatching: boolean;
}

const FestivalMatchCard = (props: Props) => {
  const { festival, showMatching, popularArtists, matchingArtists } = props;

  const themeMode = useTheme().palette.mode;

  const bigScreen = useMediaQuery('(min-width:690px)');
  const smallScreen = useMediaQuery('(max-width:439px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 7);
  const fillMatchingArtistWidth =
    maxArtistsInWidth - (matchingArtists.length % maxArtistsInWidth);
  const fillPopularArtistWidth =
    maxArtistsInWidth - (popularArtists.length % maxArtistsInWidth);

  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const classes = useStyles();

  const matchingPercentTotal = Math.ceil(festival.matching_percent_combined);
  const matchingPercentArtists = Math.ceil(festival.matching_percent_artists);
  const matchingPercentGenres = Math.ceil(festival.matching_percent_genres);

  const textSize = smallScreen ? '28px' : '25px';
  const pathColor = themeMode === 'light' ? '#3FBF3F' : '#3de53d';
  const textColor = themeMode === 'light' ? '#3FBF3F' : '#3de53d';
  const trailColor = themeMode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';

  const noLineupRegistered = popularArtists.length === 0;

  const navigateToFestival = (festivalId: string) =>
    navigate(`/festival/${festivalId}`);

  return (
    <Paper elevation={3} sx={{ pt: 1 }} key={festival.name}>
      {showMatching && <div className={classes.paddingBottom} />}
      <StyledPaddedDiv>
        <div className={classes.titleAndMatchBox}>
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
              onClick={() => {
                navigateToFestival(encodeURIComponent(festival.name));
              }}
            >
              <Typography
                variant={bigScreen ? 'h3' : 'h5'}
                sx={{
                  wordWrap: 'break-word',
                  textAlign: !showMatching ? 'center' : undefined,
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
              {displayedLocationName(festival.locationText)}{' '}
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
              <StyledMatchCircleDiv>
                <CircularProgressbar
                  value={matchingPercentTotal}
                  text={`${matchingPercentTotal}%`}
                  styles={buildStyles({
                    textSize: textSize,
                    pathTransitionDuration: 0.5,
                    pathColor: pathColor,
                    textColor: textColor,
                    trailColor: trailColor,
                  })}
                />
              </StyledMatchCircleDiv>
            </HtmlTooltip>
          )}
        </div>
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
        <div className={classes.artistAvatarBox}>
          {matchingArtists.map((artist) => (
            <ArtistBubble
              artist={artist}
              key={`avatar_match_artist_${festival.name}_${festival.year}_${artist.name}`}
              bubbleId={`avatar_match_artist_${festival.name}_${festival.year}_${artist.name}`}
            />
          ))}
          {matchingArtists.length > 0 &&
            Array.from({ length: fillMatchingArtistWidth }, (_, i) => (
              <StyledAvatarContainerdiv key={i} />
            ))}
        </div>
      )}
      {noLineupRegistered ? (
        <StyledPaddedDiv>
          <Typography
            variant="body1"
            color="primary"
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
          <div className={clsx(classes.artistAvatarBox, classes.paddingBottom)}>
            {popularArtists.length > 0 &&
              popularArtists
                .slice(0, maxArtistsInWidth)
                .map((artist) => (
                  <ArtistBubble
                    artist={artist}
                    key={`avatar_pop_artist_${festival.name}_${festival.year}_${artist.name}`}
                    bubbleId={`avatar_pop_artist_${festival.name}_${festival.year}_${artist.name}`}
                  />
                ))}
            {popularArtists.length > 0 &&
              Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                <StyledAvatarContainerdiv key={i} />
              ))}
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div
              className={clsx(classes.artistAvatarBox, classes.paddingBottom)}
            >
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
                      artist={artist}
                      key={`avatar_pop_artist_${festival.name}_${festival.year}_${artist.name}`}
                      bubbleId={`avatar_pop_artist_${festival.name}_${festival.year}_${artist.name}`}
                    />
                  ))}
              {popularArtists.length > 0 &&
                Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                  <StyledAvatarContainerdiv key={i} />
                ))}
            </div>
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
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

const StyledTitleButton = styled(Button)(({ theme: { spacing, palette } }) => {
  return {
    [`&.${buttonClasses.root}`]: {
      whiteSpace: 'normal',
      textTransform: 'none',
      textAlign: 'left',
      marginBottom: spacing(1.5),
      padding: spacing(0, 1, 0, 1),
      borderColor: palette.primary?.[palette.mode],
      '@media (min-width: 690px)': { borderStyle: 'dashed' },
      '@media (max-width: 689px)': { borderStyle: 'dotted' },
    },
  };
});

const StyledPaddedDiv = styled('div')(({ theme: { spacing } }) => {
  return {
    '@media (min-width: 690px)': {
      padding: spacing(0, 4, 0, 4),
    },
    '@media (max-width: 689px)': {
      '@media (min-width: 440px)': {
        padding: spacing(0, 2, 0, 2),
      },
    },
    '@media (max-width: 439px)': {
      padding: spacing(0, 2, 0, 2),
    },
  };
});

const StyledMatchCircleDiv = styled('div')(() => {
  return {
    '@media (min-width: 690px)': {
      width: '80px',
    },
    '@media (max-width: 689px)': {
      '@media (min-width: 440px)': {
        width: '60px',
      },
    },
    '@media (max-width: 439px)': {
      width: '50px',
    },
    userSelect: 'none',
  };
});

export default FestivalMatchCard;
