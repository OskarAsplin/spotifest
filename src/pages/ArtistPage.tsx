import React, { useEffect } from 'react';
import { AppState, DispatchProps, ArtistInfo, Artist } from "../redux/types";
import { spotifyApi, turnOnLoader, turnOffLoader, setLoggedOff } from "../redux/actions";
import { getIconPicture, getBigPicture } from "../utils/utils";
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
import { fetchToJson, getApiBaseUrl } from "../utils/restUtils";
import FestivalMatchItem from './parts/FestivalMatchItem';
import ArtistBubble from './parts/ArtistBubble';
import { lightBlue, pink } from "@material-ui/core/colors";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import ArrowBackOutlined from '@material-ui/icons/ArrowBack';
import { getMaxArtistsInWidth } from "../utils/utils";

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
            '@media (min-width: 610px)': {
                padding: theme.spacing(2, 0, 2, 0),
            },
            '@media (max-width: 609px)': {
                padding: theme.spacing(1, 0, 1, 0),
            },
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
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: theme.spacing(2, 0, 1, 0),
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
        paper2: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 610px)': {
                padding: theme.spacing(2, 4, 2, 4),
            },
            '@media (max-width: 609px)': {
                padding: theme.spacing(2, 2, 2, 2),
            },
            marginBottom: theme.spacing(2),
            width: '100%',
            alignItems: 'center',
        },
        box: {
            width: '100%',
            maxWidth: '700px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        box2: {
            width: '100%',
            maxWidth: '764px'
        },
        buttonBox: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: theme.spacing(1, 0, 1, 0),
        },
        darkerBackground: {
            backgroundColor: '#383838'
        },
        artistImgButton: {
            padding: '0px'
        },
        artistImg: {
            maxHeight: '350px',
            maxWidth: '100%',
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
        artistAvatarBox: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
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
        artistTitle: {
            textAlign: 'center'
        },
        prevAndFutureFestivalsTitle: {
            '@media (max-width: 609px)': {
                textAlign: 'center'
            },
            marginBottom: theme.spacing(1)
        },
        topLeft: {
            position: 'absolute',
            top: theme.spacing(8),
            left: theme.spacing(2),
        },
        artistTitleBox: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        },
        artistWidth: {
            '@media (min-width: 690px)': {
                width: '100px',
            },
            '@media (max-width: 689px)': {
                width: '75px',
            },
        },
    }),
);

interface StoreProps {
    model: Model;
}

type Props = DispatchProps & StoreProps;

const ArtistPage: React.FC<Props> = (props: Props) => {

    useEffect(() => {
        setIsValidSpotifyId(true);
        setIsArtistInDb(true);
        setArtistInfo(undefined);
        const queryString = window.location.search;
        if (queryString.indexOf('spotifyId=') !== -1) {
            let spotifyId = window.location.search.substring('spotifyId='.length + 1);
            props.dispatch(turnOnLoader());
            fetchToJson(getApiBaseUrl() + '/onTour/artistInfo/?spotifyId=' + spotifyId)
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
                                        hasSpotifyId: true,
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
                                    hasSpotifyId: true,
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
        } else {
            let artistName = window.location.search.substring(1);
            if (artistName) {
                props.dispatch(turnOnLoader());
                fetchToJson(getApiBaseUrl() + '/onTour/artistInfo/?q=' + artistName)
                    .then((response: any) => {
                        const responseArtist = (response as ArtistInfo)
                        setArtistInfo(responseArtist);

                        if (responseArtist.artist.spotifyId && props.model.loggedIn && props.model.accessToken) {
                            spotifyApi.setAccessToken(props.model.accessToken);
                            spotifyApi.getArtistRelatedArtists(responseArtist.artist.spotifyId)
                                .then((spotifyArtistResponse: SpotifyApi.ArtistsRelatedArtistsResponse) => {
                                    if (spotifyArtistResponse.artists.length > 0) {
                                        const related = spotifyArtistResponse.artists.map((relArtist) => {
                                            const iconPicture: string = getIconPicture(relArtist.images);
                                            return {
                                                name: relArtist.name,
                                                spotifyId: relArtist.id,
                                                hasSpotifyId: true,
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
                    }).catch((error) => {
                        console.log(error);
                        if (error instanceof TypeError) {
                            setIsNetworkError(true);
                        } else {
                            setIsArtistInDb(false);
                        }
                    }).finally(() => props.dispatch(turnOffLoader()));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.search.substring(1)]);

    const [artistInfo, setArtistInfo] = React.useState<ArtistInfo | undefined>(undefined);
    const [redirectHome, setRedirectHome] = React.useState<boolean>(false);
    const [redirectFestival, setRedirectFestival] = React.useState('');
    const [relatedArtists, setRelatedArtists] = React.useState<Artist[]>([]);
    const [expanded, setExpanded] = React.useState(false);
    const [isArtistInDb, setIsArtistInDb] = React.useState(true);
    const [isNetworkError, setIsNetworkError] = React.useState(false);
    const [isValidSpotifyId, setIsValidSpotifyId] = React.useState(true);

    const mediumScreen = useMediaQuery('(min-width:610px)');
    const bigScreen = useMediaQuery('(min-width:690px)');
    const pcScreen = useMediaQuery('(min-width:1300px)');
    const smallScreen = useMediaQuery('(max-width:363px)');
    const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, mediumScreen, smallScreen, 6);
    const fillRelatedArtistsWidth = maxArtistsInWidth - relatedArtists.length % maxArtistsInWidth;
    console.log(maxArtistsInWidth);
    console.log(fillRelatedArtistsWidth);

    const loaderOn = props.model.loaderOn;
    const muiTheme = createMuiTheme({
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
            type: props.model.thememode
        }
    });
    const indigoOrangeMuiTheme = createMuiTheme({
        typography: {
            fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
        },
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

    const classes = useStyles();

    if (redirectFestival) {
        return <Redirect push to={'/festival?' + redirectFestival} />
    }

    if (redirectHome) {
        return <Redirect push to={'/'} />
    }

    if (!artistInfo) {
        return (
            <MuiThemeProvider theme={indigoOrangeMuiTheme}>
                <CssBaseline />
                <AppBarView />
                {pcScreen && <div className={classes.topLeft}>
                    <IconButton
                        onClick={() => {
                            window.history.back();
                            setTimeout(() => setRedirectHome(true), 10);
                        }}
                    >
                        <ArrowBackOutlined fontSize='large' />
                    </IconButton>
                </div>}
                <div className={classes.align}>
                    <div className={classes.verticalSpace} />
                    <div className={classes.verticalSpace} />
                    {isNetworkError &&
                        <Typography variant="subtitle1" >
                            There seems to be some issue with connecting to our database. Try refreshing the page.
                        </Typography>
                    }
                    {!isNetworkError && (!isArtistInDb || !isValidSpotifyId) &&
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
                {pcScreen && <div className={classes.topLeft}>
                    <IconButton
                        onClick={() => {
                            window.history.back();
                            setTimeout(() => setRedirectHome(true), 10);
                        }}
                    >
                        <ArrowBackOutlined fontSize='large' />
                    </IconButton>
                </div>}
                <div className={classes.verticalSpace} />

                <div className={classes.root}>
                    <Box className={classes.box}>
                        <Paper elevation={10} className={classes.paper} key={'artistInfo:' + artistInfo.artist.name}>
                            <div className={classes.artistTitleBox}>
                                <Typography variant={bigScreen ? "h3" : mediumScreen ? "h4" : "h5"} className={classes.artistTitle}>
                                    <Box fontWeight="fontWeightBold">
                                        {artistInfo.artist.name}
                                    </Box>
                                </Typography>
                            </div>
                            <Box className={props.model.thememode === 'light' ? classes.buttonBox : clsx(classes.buttonBox, classes.darkerBackground)}>
                                <Button onClick={() => window.open(artistInfo.artist.bigPicture, '_blank')} className={classes.artistImgButton}>
                                    <img className={classes.artistImg} src={artistInfo.artist.bigPicture} alt="" />
                                </Button>
                            </Box>
                            <Typography variant="subtitle1" className={classes.addSidePadding}>
                                {'Genres: ' + artistInfo.artist.genres.join(", ")}
                            </Typography>
                            {artistInfo.artist.spotifyId &&
                                <MuiThemeProvider theme={indigoOrangeMuiTheme}>
                                    <Link color={'secondary'} variant="subtitle1"
                                        href={'https://open.spotify.com/artist/' + artistInfo.artist.spotifyId}
                                        className={classes.addSidePadding}
                                        rel="noopener noreferrer" target="_blank">
                                        Open artist in spotify
                                    </Link>
                                </MuiThemeProvider>}
                            {relatedArtists.length > 0 &&
                                <div className={clsx(classes.matchingPopularBox, classes.addSidePadding)}>
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
                            }
                            {relatedArtists.length > 0 &&
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <div className={clsx(classes.artistAvatarBox, classes.addSidePadding)}>
                                        {relatedArtists.slice(0, maxArtistsInWidth).map((artist) => (
                                            <ArtistBubble
                                                artist={artist}
                                                useSpotifyId={true}
                                                key={'avatar_rel_artist_' + artistInfo.artist.name + artist.name}
                                                thememode={props.model.thememode} />
                                        ))}
                                        {relatedArtists.length > 0 &&
                                            Array.from({ length: fillRelatedArtistsWidth }, (_, i) => <div className={classes.artistWidth} key={i} />)
                                        }
                                    </div>
                                </Collapse>
                            }
                        </Paper>
                    </Box>
                    {isArtistInDb && artistInfo.festivalsFuture.length !== 0 &&
                        <div className={classes.align}>
                            <div className={classes.verticalSpace} />
                            <Typography variant={mediumScreen ? "h4" : "h5"} className={classes.prevAndFutureFestivalsTitle}>
                                Attending festivals
                            </Typography>
                            <Box className={classes.box2}>
                                {artistInfo.festivalsFuture.map((festival, idx) =>
                                    <FestivalMatchItem festival={festival} popularArtists={festival.popular_artists} matchingArtists={[]} key={'FestivalMatchItem: ' + festival.name + festival.year} showMatching={false} />
                                )}
                            </Box>
                        </div>
                    }
                    {isArtistInDb && artistInfo.festivalsPast.length !== 0 &&
                        <div className={classes.align}>
                            <div className={classes.verticalSpace} />
                            <div className={classes.verticalSpace} />
                            <Typography variant={mediumScreen ? "h4" : "h5"} className={classes.prevAndFutureFestivalsTitle}>
                                Previously attended festivals
                            </Typography>
                            <Box className={classes.box2}>
                                {artistInfo.festivalsPast.map((festival, idx) =>
                                    <Button className={classes.paper2} key={'festivals artist attends: ' + festival.name + festival.year}
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
                    }
                    {!isArtistInDb &&
                        <div className={classes.align}>
                            <div className={classes.verticalSpace} />
                            <Typography variant="subtitle1" >
                                This artist has no registered festivals in our database.
                            </Typography>
                            <div className={classes.verticalSpace} />
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

                <MuiThemeProvider theme={indigoOrangeMuiTheme}>
                    <div hidden={!loaderOn} className={classes.progressBar}>
                        <CircularProgress size={100} thickness={3} color={'secondary'} />
                    </div>
                </MuiThemeProvider>
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
