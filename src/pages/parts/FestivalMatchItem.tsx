import React from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod, Artist } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles,  Theme, Paper, IconButton, Button, Collapse, Typography, Box, PaletteType, Tooltip } from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Redirect } from 'react-router-dom';
import ArtistBubble from './ArtistBubble';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            '@media (min-width: 690px)': {
                padding: theme.spacing(2, 4, 2, 4),
            },
            '@media (max-width: 689px)': {
                '@media (min-width: 364px)': {
                    padding: theme.spacing(2, 2, 2, 2),
                },
            },
            '@media (max-width: 363px)': {
                padding: theme.spacing(2, 1, 2, 1),
            },
            marginBottom: theme.spacing(3),
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
                width: '80px'
            },
            '@media (max-width: 689px)': {
                width: '60px'
            },
            '@media (max-width: 363px)': {
                paddingRight: theme.spacing(1)
            },
            userSelect: 'none'
        },
        festivalTitle: {
            wordWrap: 'break-word',
        },
        festivalTitleCenter: {
            wordWrap: 'break-word',
            '@media (max-width: 689px)': {
                textAlign: 'center'
            },
        },
        artistAvatarBox: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            '@media (max-width: 565px)': {
                justifyContent: 'space-between',
                minWidth: '300px'
            },
        },
        titleAndMatchBox: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            //'@media (min-width: 610px)': {
            //    flexDirection: 'row',
            //    flexWrap: 'nowrap',
            //},
            //'@media (max-width: 609px)': {
            //    flexDirection: 'column-reverse',
            //    alignItems: 'center'
            //},
            minHeight: '48px'
        },
        matchingPopularBox: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            minHeight: '48px'
        },
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
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
            '@media (min-width: 364px)': {
                marginLeft: -theme.spacing(1.3),
            },
            '@media (max-width: 363px)': {
                marginLeft: -theme.spacing(0.3),
            },
            textAlign: 'left',
            //maxWidth: '85%',
            //'@media (min-width: 610px)': {
            //    flexGrow: 1,
            //    marginLeft: -theme.spacing(1.3),
            //    textAlign: 'left',
            //    maxWidth: '85%',
            //},
            //'@media (max-width: 609px)': {
            //    maxWidth: '100%'
            //},
            paddingBottom: theme.spacing(0),
            paddingTop: theme.spacing(0),
        },
        grow: {
            flexGrow: 1,
        },
        growAlign: {
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
        },
        lineupBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: theme.spacing(1)
        },
        lineup: {
            maxHeight: 230,
            maxWidth: 284,
        },
        flexRow: {
            display: 'flex',
            flexDirection: 'row',
        },
        artistWidth: {
            width: '75px'
        },
        toolTip: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: theme.spacing(0.5)
        },
        paddingSmall: {
            '@media (max-width: 363px)': {
                paddingLeft: theme.spacing(1)
            },
        }
    }),
);

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 320,
        margin: theme.spacing(0, 2, 0, 2),
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

interface OwnProps {
    festival: FestivalMatch,
    popularArtists: Artist[],
    matchingArtists: Artist[],
    showMatching: boolean
}

interface StoreProps {
    thememode: PaletteType,
    matchingMethod: MatchingMethod
}

type Props = DispatchProps & StoreProps & OwnProps;

const FestivalMatchItem: React.FC<Props> = (props: Props) => {
    const { festival, showMatching, thememode, matchingMethod, popularArtists, matchingArtists } = props;

    const bigScreen = useMediaQuery('(min-width:690px)');
    const mediumScreen = useMediaQuery('(min-width:610px)');
    const fourMatchingArtistsFirstRow = useMediaQuery('(min-width:840px)');
    const threeMatchingArtistsFirstRowMinWidth = useMediaQuery('(min-width:740px)');
    const twoMatchingArtistsFirstRowMinWidth = useMediaQuery('(min-width:640px)');
    const threeMatchingArtistsFirstRow = threeMatchingArtistsFirstRowMinWidth && !fourMatchingArtistsFirstRow;
    const twoMatchingArtistsFirstRow = twoMatchingArtistsFirstRowMinWidth && !threeMatchingArtistsFirstRow;
    const outerPaddingAndMargin = bigScreen ? 128 : mediumScreen ? 96 : 64;
    const numArtistsInWidth = bigScreen ?
        Math.min(7, Math.floor((window.innerWidth - outerPaddingAndMargin) / 100)) :
        Math.max(4, Math.floor((window.innerWidth - outerPaddingAndMargin) / 75));
    const fillMatchingArtistWidth = numArtistsInWidth - matchingArtists.length % numArtistsInWidth;
    const fillPopularArtistWidth = numArtistsInWidth - matchingArtists.length % numArtistsInWidth;

    const [expanded, setExpanded] = React.useState(false);
    const [redirectFestival, setRedirectFestival] = React.useState('');

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
    const pathColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
    const textColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
    const trailColor = thememode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';

    const endFirstRow = () => {
        return bigScreen ? fourMatchingArtistsFirstRow ? 4 : threeMatchingArtistsFirstRow ? 3 : twoMatchingArtistsFirstRow ? 2 : matchingArtists.length : matchingArtists.length;
    }

    if (redirectFestival) {
        return <Redirect push to={'/festival?' + redirectFestival} />
    }

    return (
        <Paper elevation={3} className={classes.root} key={festival.name}>
            <div className={classes.titleLine}>
                <div className={classes.titleAndMatchBox}>
                    <div className={!showMatching && !bigScreen ? classes.growAlign : classes.grow}>
                        <Button
                            className={classes.button}
                            color="inherit"
                            onClick={() => { setRedirectFestival(encodeURIComponent(festival.name)) }}
                        >
                            <Typography variant={bigScreen ? "h2" : "h4"} className={!showMatching && !bigScreen ? classes.festivalTitleCenter : classes.festivalTitle}>
                                {festival.name}
                            </Typography>
                        </Button>
                    </div>
                    {showMatching &&
                        <div>
                            <Box className={classes.toolTip}>
                                <HtmlTooltip placement="left-start" interactive leaveTouchDelay={3000}
                                    title={
                                        <React.Fragment>
                                            <Typography color="inherit" variant={bigScreen ? 'subtitle2' : 'body2'}>{'Genres: ' + Math.ceil(festival.matching_percent_genres) + '%'}</Typography>
                                            <Typography color="inherit" variant={bigScreen ? 'subtitle2' : 'body2'}>{'Artists: ' + Math.ceil(festival.matching_percent_artists) + '%'}</Typography>
                                            <Typography color="inherit" variant={bigScreen ? 'subtitle2' : 'body2'}>{'Total: ' + Math.ceil(festival.matching_percent_combined) + '%'}</Typography>
                                        </React.Fragment>
                                    }
                                >
                                    <div className={classes.circleSize}>
                                        <CircularProgressbar value={matching_percent} text={`${matching_percent}%`}
                                            styles={buildStyles({
                                                textSize: '22px',
                                                pathTransitionDuration: 0.5,
                                                pathColor: pathColor,
                                                textColor: textColor,
                                                trailColor: trailColor,
                                                //backgroundColor: '#3e98c7',
                                            })}
                                        />
                                        {/*<CircularProgressbarWithChildren value={matchingMethod === MatchingMethod.Genre ? matching_percent : Math.min(festival.matching_artists.length*10, 100)}
                                            styles={buildStyles({
                                                //textSize: '22px',
                                                pathTransitionDuration: 0.5,
                                                pathColor: pathColor,
                                                textColor: textColor,
                                                trailColor: trailColor,
                                            })}
                                        >
                                            <div className={classes.artistAvatarBox}>
                                                <div style={{ fontSize: '18px', marginTop: -2, marginLeft: 3, color: textColor }}>
                                                    {matchingMethod === MatchingMethod.Genre ? matching_percent + '%' : festival.matching_artists.length}
                                                </div>
                                                {matchingMethod === MatchingMethod.Artist && <MusicNote style={{ marginTop: 0, color: textColor }} fontSize={'small'} />}
                                            </div>
                                        </CircularProgressbarWithChildren>*/}
                                    </div>
                                </HtmlTooltip>
                            </Box>
                        </div>
                    }
                </div>
            </div>
            <div className={classes.root2}>
                <div id={'details_and_matching_artists_and_lineup'} className={classes.flexRow}>
                    <div id={'details_and_matching_artists'} className={classes.grow}>
                        {festival.cancelled ?
                            <Typography variant="subtitle1" color='secondary' className={classes.paddingSmall}>
                                {'CANCELLED' + (festival.date ? ' (' + festival.date + ', ' + festival.year + ')' : '')}
                            </Typography> :
                            <Typography variant="subtitle1" className={classes.paddingSmall}>
                                {festival.date + ', ' + festival.year}
                            </Typography>}
                        <Typography variant="subtitle1" className={classes.paddingSmall}>
                            {festival.locationText}
                        </Typography>
                        <Typography variant="subtitle1" className={classes.paddingSmall}>
                            {'Genres: ' + festival.top_genres.slice(0, 3).join(", ")}
                        </Typography>
                        {!bigScreen && festival.festivalImg && <div className={classes.lineupBox}>
                            <Button onClick={() => window.open(festival.festivalImg, '_blank')}>
                                <img className={classes.lineup} src={festival.festivalImg} alt="" />
                            </Button>
                        </div>}
                        {showMatching &&
                            <div className={classes.matchingPopularBox}>
                                <Typography variant="body1" color='primary' component="div" className={classes.paddingSmall}>
                                    <Box fontWeight="fontWeightBold">
                                        {matchingArtists.length > 0 ? 'Matching artists' : 'No matching artists'}
                                    </Box>
                                </Typography>
                            </div>
                        }
                        {showMatching &&
                            <div className={classes.artistAvatarBox}>
                                {matchingArtists.length > 0 &&
                                    matchingArtists
                                        .slice(0, endFirstRow())
                                        .map((artist) => (
                                            <ArtistBubble
                                                artist={artist}
                                                key={'avatar_match_artist_' + festival.name + festival.year + artist.name}
                                                thememode={thememode} />
                                        )
                                        )}
                                {!bigScreen && matchingArtists.length > 0 &&
                                    Array.from({ length: fillMatchingArtistWidth }, (_, i) => <div className={classes.artistWidth} key={i} />)
                                }
                            </div>
                        }
                    </div>
                    {bigScreen && festival.festivalImg && <div className={classes.lineupBox}>
                        <Button onClick={() => window.open(festival.festivalImg, '_blank')}>
                            <img className={classes.lineup} src={festival.festivalImg} alt="" />
                        </Button>
                    </div>}
                </div>
                {showMatching && bigScreen &&
                    <div className={classes.artistAvatarBox}>
                        {matchingArtists.length > 0 &&
                            matchingArtists
                                .slice(endFirstRow())
                                .map((artist) => (
                                    <ArtistBubble
                                        artist={artist}
                                        key={'avatar_match_artist_' + festival.name + festival.year + artist.name}
                                        thememode={thememode} />
                                )
                                )}
                    </div>
                }
                <div className={classes.matchingPopularBox}>
                    <Typography variant="body1" color='primary' component="div" className={classes.paddingSmall}>
                        <Box fontWeight="fontWeightBold" onClick={() => setExpanded(!expanded)}>
                            Popular artists at this festival
                        </Box>
                    </Typography>
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
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <div className={classes.artistAvatarBox}>
                        {popularArtists.length > 0 &&
                            popularArtists.slice(0, numArtistsInWidth > 4 ? numArtistsInWidth * 2 : numArtistsInWidth * 3).map((artist) => (
                                <ArtistBubble
                                    artist={artist}
                                    key={'avatar_pop_artist_' + festival.name + festival.year + artist.name}
                                    thememode={thememode} />
                            )
                            )}
                        {!bigScreen && popularArtists.length > 0 &&
                            Array.from({ length: fillPopularArtistWidth }, (_, i) => <div className={classes.artistWidth} key={i} />)
                        }
                    </div>
                </Collapse>
            </div>
        </Paper>
    );
};

const mapStateToProps = (state: AppState) => ({
    thememode: state.model.thememode,
    matchingMethod: state.model.matchingMethod
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FestivalMatchItem);
