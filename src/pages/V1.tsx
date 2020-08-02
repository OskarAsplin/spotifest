import React, { useEffect } from 'react';
import { AppState, DispatchProps } from "../redux/types";
import { initializeSite, setAccessToken, setTokenExpiryDate, setLoggedOff, spotifyApi } from "../redux/actions";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Typography } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import FestivalMatchView from "./parts/FestivalMatchView";
import FestivalMatchSettingsBar from "./parts/FestivalMatchSettingsBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { deepOrange, indigo, pink, lightBlue } from "@material-ui/core/colors";
import { Model } from "../redux/types";
import { authorizeHref } from "./LoginScreen";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
import { Redirect } from 'react-router-dom';
//import SplashScreen from "../components/splashScreen";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 440px)': {
                padding: theme.spacing(0, 2, 0, 2),
            },
            '@media (max-width: 439px)': {
                padding: theme.spacing(0, 1, 0, 1),
            },
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        verticalSpace: {
            display: 'flex',
            '@media (min-width: 800px)': {
                padding: theme.spacing(2, 0, 2, 0),
            },
            '@media (max-width: 799px)': {
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
    }),
);

interface StoreProps {
    model: Model;
}

type Props = DispatchProps & StoreProps;

// Get the hash of the url
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

const getExpiresInFromUrl = () => {
    const url = window.location.href;
    const expire_pos = url.search('expires_in');
    if (expire_pos !== -1) {
        return url.slice(expire_pos + 11);
    } else {
        return '';
    }
};

const expires_in = getExpiresInFromUrl();
const token = getAccessTokenFromHashParams();

window.history.pushState("", document.title, window.location.pathname + window.location.search);

const V1: React.FC<Props> = (props: Props) => {

    useEffect(() => {
        if (token) {
            props.dispatch(setAccessToken(token));
            spotifyApi.setAccessToken(token);
            if (!props.model.siteInitialized) {
                initializeSite(token, props.dispatch);
            }
            if (expires_in) {
                props.dispatch(setTokenExpiryDate(+expires_in));
            }
        } else if (props.model.accessToken) {
            spotifyApi.setAccessToken(props.model.accessToken);
            if (!props.model.siteInitialized) {
                initializeSite(token, props.dispatch);
            }
            if (props.model.tokenExpiryDate !== '') {
                const unixTimeNow = new Date().getTime();
                const tenMinMilliseconds = 600000;
                const oneDayMilliseconds = 86400000;
                const unixTimeExpiry = Date.parse(props.model.tokenExpiryDate);
                if (unixTimeNow > unixTimeExpiry + oneDayMilliseconds) {
                    props.dispatch(setLoggedOff());
                } else if (unixTimeNow > unixTimeExpiry - tenMinMilliseconds) {
                    props.dispatch(setAccessToken(''));
                    window.open(authorizeHref, '_self');
                }
            }
        } else {
            props.dispatch(setLoggedOff());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    if (!props.model.loggedIn || (!token && !props.model.accessToken && !props.model.tokenExpiryDate)) {
        return <Redirect push to='/login' />
    }
    return (
        //<SplashScreen>
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <AppBarView />
            <div className={classes.verticalSpace} />
            <div className={classes.root}>
                <FestivalMatchSettingsBar />
                {props.model.isDbOnline &&
                    <FestivalMatchView />}
            </div>
            {!props.model.isDbOnline &&
                <div className={classes.root}>
                    <Typography variant="subtitle1" >
                        There seems to be some issue with connecting to our database. Try refreshing the page.
                    </Typography>
                </div>}
            <div hidden={!loaderOn} className={classes.progressBar}>
                <MuiThemeProvider theme={indigoOrangeMuiTheme}>
                    <CircularProgress size={100} thickness={3} color={'secondary'} />
                </MuiThemeProvider>
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
