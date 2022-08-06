import { useState, Fragment } from 'react';
import {
  Theme,
  Paper,
  IconButton,
  Button,
  Collapse,
  Typography,
  Box,
  PaletteMode,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactCountryFlag from 'react-country-flag';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectThememode } from '../redux/reducers/displaySlice';
import { selectMatchingMethod } from '../redux/reducers/festivalMatchingSlice';
import { FestivalMatch, MatchingMethod, Artist } from '../redux/types';
import { getMaxArtistsInWidth, displayedLocationName } from '../utils/utils';
import ArtistBubble from './ArtistBubble';
import HtmlTooltip from './HtmlTooltip';

const useStyles = makeStyles(({ spacing, transitions, palette }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      padding: spacing(1, 0, 0, 0),
      marginBottom: spacing(3),
      width: '100%',
    },
    root2: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      width: '100%',
    },
    circleSize: {
      '@media (min-width: 690px)': {
        width: '60px',
      },
      '@media (max-width: 689px)': {
        '@media (min-width: 440px)': {
          width: '50px',
        },
      },
      '@media (max-width: 439px)': {
        width: '40px',
      },
      userSelect: 'none',
    },
    festivalTitle: {
      wordWrap: 'break-word',
    },
    festivalTitleCenter: {
      wordWrap: 'break-word',
      textAlign: 'center',
    },
    artistAvatarBox: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    addSidePadding: {
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
    },
    addSmallSidePadding: {
      '@media (min-width: 440px)': {
        padding: spacing(0, 2, 0, 2),
      },
      '@media (max-width: 439px)': {
        padding: spacing(0, 1, 0, 1),
      },
    },
    artistAvatarBoxFirstRow: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    matchingPopularBoxFirstRow: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      minHeight: '48px',
    },
    titleAndMatchBox: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
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
    titleLine: {
      width: '100%',
    },
    button: {
      whiteSpace: 'normal',
      textTransform: 'none',
      marginLeft: -spacing(1.25),
      textAlign: 'left',
      padding: spacing(0, 1, 0, 1),
    },
    grow: {
      flexGrow: 1,
    },
    detailsAndMatching: {
      flexGrow: 1,
      '@media (min-width: 690px)': {
        maxWidth: '45%',
      },
    },
    growAlign: {
      display: 'flex',
      justifyContent: 'center',
      flexGrow: 1,
    },
    darkerBackground: {
      '@media (max-width: 689px)': {
        backgroundColor: '#383838',
      },
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
    artistWidth: {
      '@media (min-width: 690px)': {
        width: '100px',
      },
      '@media (max-width: 689px)': {
        width: '75px',
      },
    },
    toolTip: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    paddingBottom: {
      paddingBottom: spacing(1),
    },
    expandLine: {
      display: 'flex',
      justifyContent: 'center',
    },
    expandLineGradient: {
      background:
        palette.mode === 'dark'
          ? `linear-gradient(${palette.grey[800]}, #505050);`
          : undefined,
    },
  })
);

interface OwnProps {
  festival: FestivalMatch;
  popularArtists: Artist[];
  matchingArtists: Artist[];
  showMatching: boolean;
}

type Props = OwnProps;

const FestivalMatchCard: React.FC<Props> = (props: Props) => {
  const { festival, showMatching, popularArtists, matchingArtists } = props;

  const thememode: PaletteMode = useSelector(selectThememode);
  const matchingMethod: MatchingMethod = useSelector(selectMatchingMethod);

  const bigScreen = useMediaQuery('(min-width:690px)');
  const smallScreen = useMediaQuery('(max-width:439px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 7);
  const fillMatchingArtistWidth =
    maxArtistsInWidth - (matchingArtists.length % maxArtistsInWidth);
  const fillPopularArtistWidth =
    maxArtistsInWidth - (popularArtists.length % maxArtistsInWidth);

  const [expanded, setExpanded] = useState(false);
  const [NavigateFestival, setNavigateFestival] = useState('');

  const classes = useStyles();

  let matching_percent: number = 0;
  switch (matchingMethod) {
    case MatchingMethod.Genre:
      matching_percent = Math.ceil(festival.matching_percent_combined);
      break;
    case MatchingMethod.Artist:
      matching_percent = Math.ceil(festival.matching_percent_artists);
      break;
    default:
      break;
  }
  const textSize = smallScreen ? '28px' : '25px';
  const pathColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
  const textColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
  const trailColor = thememode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';

  const noLineupRegistered = popularArtists.length === 0;

  const twoArtistsNextToPicture = bigScreen && matchingArtists.length <= 2;
  const threeArtistsNextToPicture =
    useMediaQuery('(min-width:810px)') && matchingArtists.length <= 3;
  const matchingNextToPicture =
    twoArtistsNextToPicture || threeArtistsNextToPicture;

  const matchingArtistsText = (className: string = '') => {
    return (
      <Typography
        variant="body1"
        color="primary"
        component="div"
        className={className}
      >
        <Box fontWeight="fontWeightBold">
          {matchingArtists.length > 0
            ? 'Matching artists'
            : 'No matching artists'}
        </Box>
      </Typography>
    );
  };

  if (NavigateFestival)
    return <Navigate to={'/festival/' + NavigateFestival} />;

  return (
    <Paper elevation={3} className={classes.root} key={festival.name}>
      {showMatching && <div className={classes.paddingBottom} />}
      <div className={classes.titleLine}>
        <div className={clsx(classes.titleAndMatchBox, classes.addSidePadding)}>
          <div className={!showMatching ? classes.growAlign : classes.grow}>
            <Button
              className={classes.button}
              color="inherit"
              onClick={() => {
                setNavigateFestival(encodeURIComponent(festival.name));
              }}
            >
              <Typography
                variant={bigScreen ? 'h3' : 'h5'}
                className={
                  !showMatching
                    ? classes.festivalTitleCenter
                    : classes.festivalTitle
                }
              >
                <Box fontWeight="fontWeightBold">{festival.name}</Box>
              </Typography>
            </Button>
          </div>
          {showMatching && (
            <div>
              <Box className={classes.toolTip}>
                <HtmlTooltip
                  sx={{ mx: 2 }}
                  placement="left-start"
                  leaveTouchDelay={3000}
                  title={
                    <Fragment>
                      <Typography
                        color="inherit"
                        variant={bigScreen ? 'subtitle2' : 'body2'}
                      >
                        {'Genres: ' +
                          Math.ceil(festival.matching_percent_genres) +
                          '%'}
                      </Typography>
                      <Typography
                        color="inherit"
                        variant={bigScreen ? 'subtitle2' : 'body2'}
                      >
                        {'Artists: ' +
                          Math.ceil(festival.matching_percent_artists) +
                          '%'}
                      </Typography>
                      <Typography
                        color="inherit"
                        variant={bigScreen ? 'subtitle2' : 'body2'}
                      >
                        {'Total: ' +
                          Math.ceil(festival.matching_percent_combined) +
                          '%'}
                      </Typography>
                    </Fragment>
                  }
                >
                  <div className={classes.circleSize}>
                    <CircularProgressbar
                      value={matching_percent}
                      text={`${matching_percent}%`}
                      styles={buildStyles({
                        textSize: textSize,
                        pathTransitionDuration: 0.5,
                        pathColor: pathColor,
                        textColor: textColor,
                        trailColor: trailColor,
                      })}
                    />
                  </div>
                </HtmlTooltip>
              </Box>
            </div>
          )}
        </div>
      </div>
      <div className={classes.root2}>
        <div
          id={'details_and_matching_artists_and_lineup'}
          className={classes.flexRow}
        >
          <div
            id={'details_and_matching_artists'}
            className={classes.detailsAndMatching}
          >
            {festival.cancelled ? (
              <Typography
                variant="subtitle2"
                color="secondary"
                className={classes.addSidePadding}
              >
                {'CANCELLED' +
                  (festival.date
                    ? ' (' + festival.date + ', ' + festival.year + ')'
                    : '')}
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                className={classes.addSidePadding}
              >
                {festival.date + ', ' + festival.year}
              </Typography>
            )}
            <Typography variant="subtitle2" className={classes.addSidePadding}>
              {displayedLocationName(festival.locationText)}{' '}
              <ReactCountryFlag
                countryCode={festival.country}
                svg
                style={{ marginLeft: '8px' }}
              />
            </Typography>
            <Typography
              variant="subtitle2"
              className={classes.addSidePadding}
              noWrap
            >
              {'Genres: ' + festival.top_genres.slice(0, 3).join(', ')}
            </Typography>
            {showMatching && !noLineupRegistered && matchingNextToPicture && (
              <>
                <div className={classes.matchingPopularBoxFirstRow}>
                  {matchingArtistsText(classes.addSidePadding)}
                </div>
                <div
                  className={clsx(
                    classes.artistAvatarBoxFirstRow,
                    classes.addSmallSidePadding
                  )}
                >
                  {matchingArtists.map((artist) => (
                    <ArtistBubble
                      artist={artist}
                      key={
                        'avatar_match_artist_' +
                        festival.name +
                        festival.year +
                        artist.name
                      }
                      bubbleId={
                        'avatar_match_artist_' +
                        festival.name +
                        festival.year +
                        artist.name
                      }
                      thememode={thememode}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {showMatching && !noLineupRegistered && !matchingNextToPicture && (
          <>
            <div
              className={clsx(
                classes.matchingPopularBox,
                classes.addSidePadding
              )}
            >
              {matchingArtistsText()}
            </div>
            <div
              className={clsx(
                classes.artistAvatarBox,
                classes.addSmallSidePadding
              )}
            >
              {matchingArtists.map((artist) => (
                <ArtistBubble
                  artist={artist}
                  key={
                    'avatar_match_artist_' +
                    festival.name +
                    festival.year +
                    artist.name
                  }
                  bubbleId={
                    'avatar_match_artist_' +
                    festival.name +
                    festival.year +
                    artist.name
                  }
                  thememode={thememode}
                />
              ))}
              {matchingArtists.length > 0 &&
                Array.from({ length: fillMatchingArtistWidth }, (_, i) => (
                  <div className={classes.artistWidth} key={i} />
                ))}
            </div>
          </>
        )}
        {noLineupRegistered ? (
          <div
            className={clsx(classes.matchingPopularBox, classes.addSidePadding)}
          >
            <Typography variant="body1" color="primary" component="div">
              <Box fontWeight="fontWeightBold">No lineup registered yet</Box>
            </Typography>
          </div>
        ) : (
          <>
            <div
              className={clsx(
                classes.matchingPopularBox,
                classes.addSidePadding
              )}
            >
              <Typography variant="body1" color="primary" component="div">
                <Box
                  fontWeight="fontWeightBold"
                  onClick={() => setExpanded(!expanded)}
                >
                  Popular artists at this festival
                </Box>
              </Typography>
            </div>
            <div
              className={clsx(
                classes.artistAvatarBox,
                classes.addSmallSidePadding,
                classes.paddingBottom
              )}
            >
              {popularArtists.length > 0 &&
                popularArtists
                  .slice(0, maxArtistsInWidth)
                  .map((artist) => (
                    <ArtistBubble
                      artist={artist}
                      key={
                        'avatar_pop_artist_' +
                        festival.name +
                        festival.year +
                        artist.name
                      }
                      bubbleId={
                        'avatar_pop_artist_' +
                        festival.name +
                        festival.year +
                        artist.name
                      }
                      thememode={thememode}
                    />
                  ))}
              {popularArtists.length > 0 &&
                Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                  <div className={classes.artistWidth} key={i} />
                ))}
            </div>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <div
                className={clsx(
                  classes.artistAvatarBox,
                  classes.addSmallSidePadding,
                  classes.paddingBottom
                )}
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
                        key={
                          'avatar_pop_artist_' +
                          festival.name +
                          festival.year +
                          artist.name
                        }
                        bubbleId={
                          'avatar_pop_artist_' +
                          festival.name +
                          festival.year +
                          artist.name
                        }
                        thememode={thememode}
                      />
                    ))}
                {popularArtists.length > 0 &&
                  Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                    <div className={classes.artistWidth} key={i} />
                  ))}
              </div>
            </Collapse>
            {popularArtists.length > maxArtistsInWidth && (
              <div
                className={
                  expanded
                    ? classes.expandLine
                    : clsx(classes.expandLine, classes.expandLineGradient)
                }
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
              </div>
            )}
          </>
        )}
      </div>
    </Paper>
  );
};

export default FestivalMatchCard;
