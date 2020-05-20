import React, { useEffect } from 'react';
import { AppState, DispatchProps, ArtistInfo, Artist } from "../redux/types";
import { spotifyApi, turnOnLoader, turnOffLoader, getIconPicture, getBigPicture, setLoggedOff } from "../redux/actions";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Box, Paper, Typography, Link, Button, IconButton, Collapse } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import deepOrange from "@material-ui/core/colors/deepOrange";
import indigo from "@material-ui/core/colors/indigo";
import { Model } from "../redux/types";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
import { Redirect } from 'react-router-dom';
import { fetchToJson } from "../utils/restUtils";
import FestivalMatchItem from './parts/FestivalMatchItem';
import ArtistBubble from './parts/ArtistBubble';
import { lightBlue, pink } from "@material-ui/core/colors";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 2, 0, 2),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        verticalSpace: {
            display: 'flex',
            padding: theme.spacing(2, 0, 2, 0),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        progressBar: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginTop: '-50px',
            marginLeft: '-50px'
        },
        paper: {
            display: 'flex',
            '@media (min-width: 500px)': {
                padding: theme.spacing(2, 4, 2, 4),
                flexDirection: 'row',
            },
            '@media (max-width: 499px)': {
                padding: theme.spacing(2, 2, 2, 2),
                flexDirection: 'column-reverse',
            },
            justifyContent: 'space-between',
            width: '100%'
        },
        paper2: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 500px)': {
                padding: theme.spacing(0, 4, 2, 4),
            },
            marginBottom: theme.spacing(2),
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        paper3: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 500px)': {
                padding: theme.spacing(2, 4, 2, 4),
            },
            '@media (max-width: 499px)': {
                padding: theme.spacing(2, 2, 2, 2),
            },
            marginBottom: theme.spacing(2),
            width: '100%',
            alignItems: 'center',
        },
        box: {
            width: '100%',
            maxWidth: '1000px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        box2: {
            width: '100%',
            maxWidth: '764px'
        },
        buttonBox: {
            '@media (min-width: 500px)': {
                maxWidth: '50%'
            },
            display: 'flex',
            alignItems: 'center',
        },
        artistImg: {
            maxHeight: 400,
            maxWidth: '100%',
        },
        flexColumn: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 500px)': {
                maxWidth: '50%'
            },
        },
        hundredWidth: {
            width: '100%'
        },
        align: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            textTransform: 'none',
            marginLeft: -theme.spacing(1.3),
            paddingBottom: theme.spacing(0),
            paddingTop: theme.spacing(0),
            textAlign: 'left',
            maxWidth: '85%'
        },
        artistAvatarBox: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            minWidth: '300px'
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
        festivalTitle: {
            '@media (max-width: 499px)': {
                textAlign: 'center'
            },
        },
    }),
);

interface StoreProps {
    model: Model;
}

type Props = DispatchProps & StoreProps;

const ArtistPage: React.FC<Props> = (props: Props) => {

    const bigScreen = useMediaQuery('(min-width:500px)');

    useEffect(() => {
        setArtistInfo(undefined);
        let spotifyId = window.location.search.substring(1);
        if (spotifyId) {
            props.dispatch(turnOnLoader());
            fetchToJson('http://127.0.0.1:8000/onTour/artistInfo/?q=' + spotifyId)
                .then((response: any) => {
                    const responseArtist = (response as ArtistInfo)
                    setArtistInfo(responseArtist);
                }).catch((error) => {
                    console.log(error);
                    if (error instanceof TypeError) {
                        setIsNetworkError(true);
                    } else {
                        setIsArtistInDb(false);
                    }
                    if (props.model.loggedIn && props.model.accessToken) {
                        spotifyApi.setAccessToken(props.model.accessToken);
                        spotifyApi.getArtist(spotifyId)
                            .then((spotifyArtistResponse: SpotifyApi.SingleArtistResponse) => {
                                const bigPicture: string = getBigPicture(spotifyArtistResponse.images);
                                setArtistInfo({
                                    artist: {
                                        name: spotifyArtistResponse.name,
                                        spotifyId: spotifyArtistResponse.id,
                                        iconPicture: '',
                                        bigPicture: bigPicture,
                                        popularity: spotifyArtistResponse.popularity,
                                        genres: spotifyArtistResponse.genres
                                    },
                                    festivalsFuture: [],
                                    festivalsPast: []
                                });
                            }).catch((error) => {
                                console.log(error);
                                if (error.status === 401) {
                                    // TODO: check if renewal time and just renew token and redirect to same page.
                                    props.dispatch(setLoggedOff());
                                } else {
                                    setIsValidSpotifyId(false);
                                }
                            });
                    }

                }).finally(() => props.dispatch(turnOffLoader()));
            if (props.model.loggedIn && props.model.accessToken) {
                spotifyApi.setAccessToken(props.model.accessToken);
                spotifyApi.getArtistRelatedArtists(spotifyId)
                    .then((spotifyArtistResponse: SpotifyApi.ArtistsRelatedArtistsResponse) => {
                        if (spotifyArtistResponse.artists.length > 0) {
                            const related = spotifyArtistResponse.artists.map((relArtist) => {
                                const iconPicture: string = getIconPicture(relArtist.images);
                                return {
                                    name: relArtist.name,
                                    spotifyId: relArtist.id,
                                    iconPicture: iconPicture,
                                    bigPicture: '',
                                    popularity: relArtist.popularity,
                                    genres: relArtist.genres
                                } as Artist
                            })
                            setRelatedArtists(related);
                        }
                    }).catch((error) => {
                        console.log(error);
                        if (error.status === 401) {
                            // TODO: check if renewal time and just renew token and redirect to same page.
                            props.dispatch(setLoggedOff());
                        } else {
                            setIsValidSpotifyId(false);
                        }
                    });
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.search.substring(1)]);

    const [artistInfo, setArtistInfo] = React.useState<ArtistInfo | undefined>(undefined);
    const [redirectFestival, setRedirectFestival] = React.useState('');
    const [relatedArtists, setRelatedArtists] = React.useState<Artist[]>([]);
    const [expanded, setExpanded] = React.useState(false);
    const [isArtistInDb, setIsArtistInDb] = React.useState(true);
    const [isNetworkError, setIsNetworkError] = React.useState(false);
    const [isValidSpotifyId, setIsValidSpotifyId] = React.useState(true);

    const loaderOn = props.model.loaderOn;
    const muiTheme = createMuiTheme({
        palette: {
            primary: {
                light: indigo[300],
                main: indigo[500],
                dark: indigo[700]
            },
            secondary: {
                light: deepOrange[300],
                main: deepOrange[500],
                dark: deepOrange[700]
            },
            type: props.model.thememode
        }
    });

    const lightBluePinkMuiTheme = createMuiTheme({
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
            type: props.model.thememode
        }
    });

    const classes = useStyles();

    if (redirectFestival) {
        return <Redirect push to={'/festival?' + redirectFestival} />
    }

    if (!artistInfo) {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <AppBarView />
                <div className={classes.align}>
                    <div className={classes.verticalSpace} />
                    <div className={classes.verticalSpace} />
                    {isNetworkError &&
                        <Typography variant="subtitle1" >
                            There seems to be some issue contacting our database. Try refreshing the page.
                        </Typography>
                    }
                    {!isNetworkError && !isValidSpotifyId &&
                        <Typography variant="subtitle1" >
                            Could not find artist.
                        </Typography>
                    }
                    {!isNetworkError && !window.location.search.substring(1) &&
                        <Typography variant="subtitle1" >
                            Invalid URL.
                        </Typography>
                    }
                </div>
                <div hidden={!loaderOn} className={classes.progressBar}>
                    <CircularProgress size={100} thickness={3} color={'secondary'} />
                </div>
            </MuiThemeProvider>
        )
    } else {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <AppBarView />
                <div className={classes.verticalSpace} />

                <div className={classes.root}>
                    <Box className={classes.box}>
                        <Paper elevation={10} className={classes.paper} key={'artistInfo:' + artistInfo.artist.name}>
                            <div className={classes.flexColumn}>
                                {bigScreen && <Typography variant={bigScreen ? "h2" : "h4"} className={classes.festivalTitle}>
                                    {artistInfo.artist.name}
                                </Typography>}
                                <Typography variant="subtitle1">
                                    {'Genres: ' + artistInfo.artist.genres.join(", ")}
                                </Typography>
                                {artistInfo.artist.spotifyId &&
                                    <Link color={'secondary'} variant="subtitle1"
                                        href={'https://open.spotify.com/artist/' + artistInfo.artist.spotifyId}
                                        rel="noopener noreferrer" target="_blank">
                                        Open artist in spotify
                                    </Link>}
                                {relatedArtists.length > 0 &&
                                    <MuiThemeProvider theme={lightBluePinkMuiTheme}>
                                        <div className={classes.matchingPopularBox}>
                                            <Typography variant="body1" color='primary' component="div" >
                                                <Box fontWeight="fontWeightBold" onClick={() => setExpanded(!expanded)}>
                                                    Related artists
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
                                    </MuiThemeProvider>
                                }
                                {relatedArtists.length > 0 &&
                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        <div className={classes.artistAvatarBox}>
                                            {relatedArtists.slice(0, bigScreen ? 4 : 3).map((artist) => (
                                                <ArtistBubble
                                                    artist={artist}
                                                    key={'avatar_rel_artist_' + artistInfo.artist.name + artist.name}
                                                    thememode={props.model.thememode} />
                                            ))}
                                        </div>
                                    </Collapse>
                                }
                            </div>
                            <Box className={classes.buttonBox}>
                                <Button onClick={() => window.open(artistInfo.artist.bigPicture, '_blank')}>
                                    <img className={classes.artistImg} src={artistInfo.artist.bigPicture} alt="" />
                                </Button>
                            </Box>
                            {!bigScreen && <Typography variant={bigScreen ? "h2" : "h4"} className={classes.festivalTitle}>
                                {artistInfo.artist.name}
                            </Typography>}
                        </Paper>
                    </Box>
                    <div className={classes.verticalSpace} />
                    {isArtistInDb && artistInfo.festivalsFuture.length !== 0 &&
                        <Box className={classes.box2}>
                            {artistInfo.festivalsFuture.map((festival, idx) =>
                                <FestivalMatchItem festival={festival} key={'FestivalMatchItem: ' + festival.name + festival.year} showMatching={false} />
                            )}
                        </Box>
                    }
                    {isArtistInDb && artistInfo.festivalsPast.length !== 0 &&
                        <MuiThemeProvider theme={lightBluePinkMuiTheme}>
                            <div className={classes.align}>
                                <div className={classes.verticalSpace} />
                                <div className={classes.verticalSpace} />
                                <Typography variant={bigScreen ? "h4" : "h5"} className={classes.festivalTitle}>
                                    Previously attended festivals
                                </Typography>
                                <div className={classes.verticalSpace} />
                                <Box className={classes.box2}>
                                    {artistInfo.festivalsPast.map((festival, idx) =>
                                        <Button className={classes.paper3} key={'festivals artist attends: ' + festival.name + festival.year}
                                            variant="outlined"
                                            onClick={() => { setRedirectFestival(encodeURIComponent(festival.name)) }}>
                                            <div className={classes.hundredWidth} key={'past festival: ' + festival.name + idx}>
                                                <Typography variant="h4">
                                                    {festival.name}
                                                </Typography>
                                                {festival.cancelled ?
                                                    <Typography variant="subtitle1" color='secondary'>
                                                        {'CANCELLED' + (festival.date ? ' (' + festival.date + ', ' + festival.year + ')' : '')}
                                                    </Typography> :
                                                    <Typography variant="subtitle1">
                                                        {festival.date + ', ' + festival.year}
                                                    </Typography>
                                                }
                                                <Typography variant="subtitle1" >
                                                    {festival.locationText}
                                                </Typography>
                                            </div>
                                        </Button>
                                    )}
                                </Box>
                            </div>
                        </MuiThemeProvider>
                    }
                    {!isArtistInDb &&
                        <div className={classes.align}>
                            <div className={classes.verticalSpace} />
                            <div className={classes.verticalSpace} />
                            <Typography variant="subtitle1" >
                                This artist has no festivals registered in our database.
                            </Typography>
                        </div>
                    }
                    {isNetworkError &&
                        <div className={classes.align}>
                            <div className={classes.verticalSpace} />
                            <div className={classes.verticalSpace} />
                            <Typography variant="subtitle1" >
                                There seems to be some issue contacting our database. Try refreshing the page.
                            </Typography>
                        </div>
                    }
                </div>

                <div hidden={!loaderOn} className={classes.progressBar}>
                    <CircularProgress size={100} thickness={3} color={'secondary'} />
                </div>

            </MuiThemeProvider>
        );
    };
}

const mapStateToProps = (state: AppState) => ({
    model: state.model
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArtistPage);
