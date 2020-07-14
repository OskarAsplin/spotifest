import React from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod, Artist } from "../../redux/types";
import { getMaxArtistsInWidth } from "../../utils/utils";
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
            padding: theme.spacing(2, 0, 1, 0),
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
            '@media (min-width: 450px)': {
                width: '60px'
            },
            '@media (max-width: 449px)': {
                width: '50px'
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
            justifyContent: 'space-between',
        },
        addSidePadding: {
            '@media (min-width: 690px)': {
                padding: theme.spacing(0, 4, 0, 4),
            },
            '@media (max-width: 689px)': {
                '@media (min-width: 364px)': {
                    padding: theme.spacing(0, 2, 0, 2),
                },
            },
            '@media (max-width: 363px)': {
                padding: theme.spacing(0, 1, 0, 1),
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
            paddingBottom: theme.spacing(0),
            paddingTop: theme.spacing(0),
        },
        grow: {
            flexGrow: 1,
        },
        detailsAndMatching: {
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
            '@media (min-width: 690px)': {
                maxWidth: '55%',
                marginTop: theme.spacing(0.5),
                padding: theme.spacing(0, 4, 0, 0),
            },
            '@media (max-width: 689px)': {
                width: '100%',
                marginTop: theme.spacing(1),
            },
        },
        darkerBackground: {
            '@media (max-width: 689px)': {
                backgroundColor: '#383838'
            }
        },
        lineup: {
            maxHeight: 260,
            maxWidth: '100%',
        },
        lineupImgButton: {
            padding: '0px'
        },
        flexRow: {
            display: 'flex',
            '@media (min-width: 690px)': {
                marginTop: theme.spacing(1),
                flexDirection: 'row',
            },
            '@media (max-width: 689px)': {
                '@media (min-width: 364px)': {
                    flexDirection: 'column',
                },
            },
            '@media (max-width: 363px)': {
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
        paddingSmall: {
            '@media (max-width: 363px)': {
                padding: theme.spacing(0, 1, 0, 1),
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
    const smallScreen = useMediaQuery('(max-width:363px)');
    const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, mediumScreen, smallScreen, 7);
    const fillMatchingArtistWidth = maxArtistsInWidth - matchingArtists.length % maxArtistsInWidth;
    const fillPopularArtistWidth = maxArtistsInWidth - matchingArtists.length % maxArtistsInWidth;

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

    const matchingNextToPicture = useMediaQuery('(min-width:750px)') && matchingArtists.length <= 3;

    if (redirectFestival) {
        return <Redirect push to={'/festival?' + redirectFestival} />
    }

    return (
        <Paper elevation={3} className={classes.root} key={festival.name}>
            <div className={classes.titleLine}>
                <div className={clsx(classes.titleAndMatchBox, classes.addSidePadding)}>
                    <div className={!showMatching && !bigScreen ? classes.growAlign : classes.grow}>
                        <Button
                            className={classes.button}
                            color="inherit"
                            onClick={() => { setRedirectFestival(encodeURIComponent(festival.name)) }}
                        >
                            <Typography variant={bigScreen ? "h3" : mediumScreen ? "h4" : "h5"} className={!showMatching && !bigScreen ? classes.festivalTitleCenter : classes.festivalTitle}>
                                <Box fontWeight="fontWeightBold">
                                    {festival.name}
                                </Box>
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
                                                textSize: '25px',
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
                    }
                </div>
            </div>
            <div className={classes.root2}>
                <div id={'details_and_matching_artists_and_lineup'} className={classes.flexRow}>
                    <div id={'details_and_matching_artists'} className={clsx(classes.detailsAndMatching, classes.addSidePadding)}>
                        {festival.cancelled ?
                            <Typography variant="subtitle2" color='secondary' className={classes.paddingSmall}>
                                {'CANCELLED' + (festival.date ? ' (' + festival.date + ', ' + festival.year + ')' : '')}
                            </Typography> :
                            <Typography variant="subtitle2" className={classes.paddingSmall}>
                                {festival.date + ', ' + festival.year}
                            </Typography>}
                        <Typography variant="subtitle2" className={classes.paddingSmall}>
                            {festival.locationText}
                        </Typography>
                        <Typography variant="subtitle2" className={classes.paddingSmall} noWrap>
                            {'Genres: ' + festival.top_genres.slice(0, 3).join(", ")}
                        </Typography>
                        {showMatching && matchingNextToPicture &&
                            <div className={classes.matchingPopularBoxFirstRow}>
                                <Typography variant="body1" color='primary' component="div" className={classes.paddingSmall}>
                                    <Box fontWeight="fontWeightBold">
                                        {matchingArtists.length > 0 ? 'Matching artists' : 'No matching artists'}
                                    </Box>
                                </Typography>
                            </div>
                        }
                        {showMatching && matchingNextToPicture &&
                            <div className={classes.artistAvatarBoxFirstRow}>
                                {matchingArtists.map((artist) => (
                                    <ArtistBubble
                                        artist={artist}
                                        key={'avatar_match_artist_' + festival.name + festival.year + artist.name}
                                        thememode={thememode} />
                                        )
                                )}
                            </div>
                        }
                    </div>
                    {festival.festivalImg && <div className={thememode === 'light' ? classes.lineupBox : clsx(classes.lineupBox, classes.darkerBackground)}>
                        <Button onClick={() => { setRedirectFestival(encodeURIComponent(festival.name)) }} className={classes.lineupImgButton} >
                            <img className={classes.lineup} src={festival.festivalImg} alt="" />
                        </Button>
                    </div>}
                </div>
                {showMatching && !matchingNextToPicture &&
                    <div className={clsx(classes.matchingPopularBox, classes.addSidePadding)}>
                        <Typography variant="body1" color='primary' component="div" className={classes.paddingSmall}>
                            <Box fontWeight="fontWeightBold">
                                {matchingArtists.length > 0 ? 'Matching artists' : 'No matching artists'}
                            </Box>
                        </Typography>
                    </div>
                }
                {showMatching && !matchingNextToPicture &&
                    <div className={clsx(classes.artistAvatarBox, classes.addSidePadding)}>
                        {matchingArtists.map((artist) => (
                            <ArtistBubble
                                artist={artist}
                                key={'avatar_match_artist_' + festival.name + festival.year + artist.name}
                                thememode={thememode} />
                                )
                        )}
                        {matchingArtists.length > 0 &&
                            Array.from({ length: fillMatchingArtistWidth }, (_, i) => <div className={classes.artistWidth} key={i} />)
                        }
                    </div>
                }
                <div className={clsx(classes.matchingPopularBox, classes.addSidePadding)}>
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
                    <div className={clsx(classes.artistAvatarBox, classes.addSidePadding)}>
                        {popularArtists.length > 0 &&
                            popularArtists.slice(0, maxArtistsInWidth > 4 ? maxArtistsInWidth * 2 : maxArtistsInWidth * 3).map((artist) => (
                                <ArtistBubble
                                    artist={artist}
                                    key={'avatar_pop_artist_' + festival.name + festival.year + artist.name}
                                    thememode={thememode} />
                            )
                            )}
                        {popularArtists.length > 0 &&
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
