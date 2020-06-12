import React from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, MuiThemeProvider, Theme, Paper, IconButton, Button, Collapse, Typography, Box, PaletteType, Tooltip } from "@material-ui/core";
import { withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { lightBlue, pink } from "@material-ui/core/colors";
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
            '@media (min-width: 610px)': {
                padding: theme.spacing(2, 4, 2, 4),
            },
            '@media (max-width: 609px)': {
                padding: theme.spacing(2, 2, 2, 2),
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
            '@media (min-width: 610px)': {
                width: '80px'
            },
            '@media (max-width: 609px)': {
                width: '60px'
            },
        },
        festivalTitle: {
            wordWrap: 'break-word',
        },
        festivalTitleCenter: {
            wordWrap: 'break-word',
            '@media (max-width: 609px)': {
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
            marginLeft: -theme.spacing(1.3),
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
        width100: {
            width: '100px'
        },
        width200: {
            width: '200px'
        },
        toolTip: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: theme.spacing(0.5)
        },
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
    showMatching: boolean
}

interface StoreProps {
    thememode: PaletteType,
    matchingMethod: MatchingMethod
}

type Props = DispatchProps & StoreProps & OwnProps;

const FestivalMatchItem: React.FC<Props> = (props: Props) => {
    const bigScreen = useMediaQuery('(min-width:610px)');
    const fourMatchingArtistsFirstRow = useMediaQuery('(min-width:840px)');
    const threeMatchingArtistsFirstRowMinWidth = useMediaQuery('(min-width:740px)');
    const twoMatchingArtistsFirstRowMinWidth = useMediaQuery('(min-width:640px)');
    const threeMatchingArtistsFirstRow = threeMatchingArtistsFirstRowMinWidth && !fourMatchingArtistsFirstRow;
    const twoMatchingArtistsFirstRow = twoMatchingArtistsFirstRowMinWidth && !threeMatchingArtistsFirstRow;
    const threeArtistWidth = useMediaQuery('(max-width:464px)');
    const fourArtistMinWidth = useMediaQuery('(min-width:465px)');
    const fourArtistMaxWidth = useMediaQuery('(max-width:565px)');
    const fourArtistWidth = fourArtistMinWidth && fourArtistMaxWidth;

    const { festival, showMatching, thememode, matchingMethod } = props;
    const [expanded, setExpanded] = React.useState(false);
    const [redirectFestival, setRedirectFestival] = React.useState('');

    const lightBluePinkMuiTheme = createMuiTheme({
        typography: {
            fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
        },
        palette: {
            primary: {
                light: lightBlue[300],
                main: lightBlue[500],
                dark: lightBlue[700]
            },
            secondary: {
                light: pink[300],
                main: pink[500],
                dark: pink[700]
            },
            type: thememode
        }
    });

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
        return bigScreen ? fourMatchingArtistsFirstRow ? 4 : threeMatchingArtistsFirstRow ? 3 : twoMatchingArtistsFirstRow ? 2 : undefined : undefined;
    }

    if (redirectFestival) {
        return <Redirect push to={'/festival?' + redirectFestival} />
    }

    return (
        <Paper elevation={3} className={classes.root} key={festival.name}>
            <MuiThemeProvider theme={lightBluePinkMuiTheme}>
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
                                    <HtmlTooltip placement="left-start" interactive enterTouchDelay={0} leaveTouchDelay={3000}
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
                                <Typography variant="subtitle1" color='secondary'>
                                    {'CANCELLED' + (festival.date ? ' (' + festival.date + ', ' + festival.year + ')' : '')}
                                </Typography> :
                                <Typography variant="subtitle1">
                                    {festival.date + ', ' + festival.year}
                                </Typography>}
                            <Typography variant="subtitle1">
                                {festival.locationText}
                            </Typography>
                            <Typography variant="subtitle1">
                                {'Genres: ' + festival.top_genres.slice(0, 3).join(", ")}
                            </Typography>
                            {!bigScreen && festival.festivalImg && <div className={classes.lineupBox}>
                                <Button onClick={() => window.open(festival.festivalImg, '_blank')}>
                                    <img className={classes.lineup} src={festival.festivalImg} alt="" />
                                </Button>
                            </div>}
                            {showMatching &&
                                <div className={classes.matchingPopularBox}>
                                    <Typography variant="body1" color='primary' component="div" >
                                        <Box fontWeight="fontWeightBold">
                                            {festival.matching_artists.length > 0 ? 'Matching artists' : 'No matching artists'}
                                        </Box>
                                    </Typography>
                                </div>
                            }
                            {showMatching &&
                                <div className={classes.artistAvatarBox}>
                                    {festival.matching_artists.length > 0 &&
                                        festival.matching_artists
                                            .slice(0, endFirstRow())
                                            .map((artist) => (
                                                <ArtistBubble
                                                    artist={artist}
                                                    key={'avatar_match_artist_' + festival.name + festival.year + artist.name}
                                                    thememode={thememode} />
                                            )
                                            )}
                                    {!bigScreen && threeArtistWidth &&
                                        (festival.matching_artists.length - 2) % 3 === 0 &&
                                        <div className={classes.width100} />
                                    }
                                    {!bigScreen && fourArtistWidth &&
                                        (festival.matching_artists.length - 3) % 4 === 0 &&
                                        <div className={classes.width100} />
                                    }
                                    {!bigScreen && fourArtistWidth &&
                                        (festival.matching_artists.length - 2) % 4 === 0 &&
                                        <div className={classes.width200} />
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
                            {festival.matching_artists.length > 0 &&
                                festival.matching_artists
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
                        <Typography variant="body1" color='primary' component="div" >
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
                            {festival.popular_artists.length > 0 &&
                                festival.popular_artists.slice(0, bigScreen ? 14 : 12).map((artist) => (
                                    <ArtistBubble
                                        artist={artist}
                                        key={'avatar_pop_artist_' + festival.name + festival.year + artist.name}
                                        thememode={thememode} />
                                )
                                )}
                            {!bigScreen && threeArtistWidth &&
                                (festival.popular_artists.length - 2) % 3 === 0 &&
                                <div className={classes.width100} />
                            }
                            {!bigScreen && fourArtistWidth &&
                                (festival.popular_artists.length - 3) % 4 === 0 &&
                                <div className={classes.width100} />
                            }
                            {!bigScreen && fourArtistWidth &&
                                (festival.popular_artists.length - 2) % 4 === 0 &&
                                <div className={classes.width200} />
                            }
                        </div>
                    </Collapse>
                </div>
            </MuiThemeProvider>
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
