import React, { useEffect } from 'react';
import { AppState, DispatchProps, Artist, UserInfo, Playlist } from "../redux/types";
import { testFestivalMatches, setLoggedOff, setUserInfo, setTopArtists, setPlaylists } from "../redux/actions";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import FestivalMatchView from "./parts/FestivalMatchView";
import FestivalMatchSettingsBar from "./parts/FestivalMatchSettingsBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import deepOrange from "@material-ui/core/colors/deepOrange";
import indigo from "@material-ui/core/colors/indigo";
import { Model } from "../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
//import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
//import SplashScreen from "../components/splashScreen";

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 4, 0, 4),
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
    }),
);

interface StoreProps {
    model: Model;
}

type Props = DispatchProps & StoreProps;

const V1: React.FC<Props> = (props: Props) => {

    useEffect(() => {
        const token = getAccessTokenFromHashParams();
        if (token) {
            spotifyApi.setAccessToken(token);
            collectUserDataAndTestMatches();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //const smallScreen = useMediaQuery('(max-width:610px)');

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

    const classes = useStyles();

    const getAccessTokenFromHashParams = () => {
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q);
        while (e) {
            if (e[1] === 'access_token') {
                return decodeURIComponent(e[2]);
            }
        }
        return '';
    };

    const token = getAccessTokenFromHashParams();

    const collectUserDataAndTestMatches = () => {
        if (token) {
            spotifyApi.setAccessToken(token);
        }

        spotifyApi.getMe().then((responseGetMe: SpotifyApi.CurrentUsersProfileResponse) => {
            console.log('getMe response: ');
            console.log(responseGetMe)

            const userInfo: UserInfo = {
                country: responseGetMe.country,
                displayName: responseGetMe.display_name ? responseGetMe.display_name : undefined,
                profilePictureUrl: responseGetMe.images ? responseGetMe.images[0].url : undefined,
                spotifyUrl: responseGetMe.external_urls.spotify,
                id: responseGetMe.id
            }

            props.dispatch(setUserInfo(userInfo));


            spotifyApi.getMyTopArtists({ limit: 50 })
                .then((response: SpotifyApi.UsersTopArtistsResponse) => {
                    console.log('getTopArtists response: ');
                    console.log(response);
                    const topArtists: Artist[] = response.items.map((artist) => {
                        return {
                            name: artist.name,
                            spotifyId: artist.id,
                            picture: artist.images[0]?.url ? artist.images[0].url : undefined,
                            genres: artist.genres
                        } as Artist;
                    });

                    props.dispatch(setTopArtists(topArtists));
                    testFestivalMatches(topArtists, true, props.dispatch);
                })
                .catch((error) => {
                    console.log(error);
                    props.dispatch(setLoggedOff());
                })

            spotifyApi.getUserPlaylists(responseGetMe.id, { limit: 50 })
                .then((response: SpotifyApi.ListOfUsersPlaylistsResponse) => {
                    console.log('getUserPlaylists response: ');
                    console.log(response);

                    const playlists: Playlist[] = response.items.map((playlist) => {
                        const formattedPlaylist: Playlist = {
                            name: playlist.name,
                            id: playlist.id,
                            images: playlist.images.map((image) => { return image.url; }),
                            ownerId: playlist.owner.id,
                            numTracks: playlist.tracks.total
                        };
                        return formattedPlaylist;
                    });

                    props.dispatch(setPlaylists(playlists));
                })
                .catch((error) => {
                    console.log(error);
                    props.dispatch(setLoggedOff());
                })
        }).catch((error) => {
            console.log(error);
            props.dispatch(setLoggedOff());
        })

    }

    if (!props.model.loggedIn || !token) {
        return <Redirect to='/login' />
    }
    return (
        //<SplashScreen>
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <AppBarView />
            <div className={classes.verticalSpace} />
            <div className={classes.root}>
                <FestivalMatchSettingsBar />
                <FestivalMatchView />
            </div>

            <div hidden={!loaderOn} className={classes.progressBar}>
                <CircularProgress size={100} thickness={3} color={'secondary'} />
            </div>

        </MuiThemeProvider>
        //</SplashScreen>
    );
};

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
)(V1);
