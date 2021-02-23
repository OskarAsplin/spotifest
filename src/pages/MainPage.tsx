import { createStyles, CssBaseline, MuiThemeProvider, Theme, Typography, CircularProgress, PaletteType } from "@material-ui/core";
import { deepOrange, indigo, pink, lightBlue } from "@material-ui/core/colors";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AppBarView from "../components/AppBarView";
import FestivalMatchesDisplay from "../components/FestivalMatchesDisplay";
import FestivalMatchSettingsBar from "../components/FestivalMatchSettingsBar";
import { getAuthorizeHref } from "../oauthConfig";
import { initializeSite, spotifyApi } from "../redux/asyncActions";
import { selectLoggedIn, selectAccessToken, selectTokenExpiryDate, setAccessToken, setTokenExpiryDate, setLoggedOff } from '../redux/reducers/authorizationSlice';
import { selectLoaderOn, selectThememode, selectIsDbOnline, selectSiteInitialized } from '../redux/reducers/displaySlice';
import '../styles/base.scss';
import { getHashParams, removeHashParamsFromUrl } from '../utils/hashUtils';

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
    }),
);

const hashParams = getHashParams();
const token = hashParams.access_token;
const expires_in = hashParams.expires_in;
removeHashParamsFromUrl();

const MainPage = () => {

    const loaderOn: boolean = useSelector(selectLoaderOn);
    const thememode: PaletteType = useSelector(selectThememode);
    const isDbOnline: boolean = useSelector(selectIsDbOnline);
    const siteInitialized: boolean = useSelector(selectSiteInitialized);
    const loggedIn: boolean = useSelector(selectLoggedIn);
    const accessToken: string = useSelector(selectAccessToken);
    const tokenExpiryDate: string = useSelector(selectTokenExpiryDate);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(setAccessToken(token));
            spotifyApi.setAccessToken(token);
            if (!siteInitialized) {
                dispatch(initializeSite(token));
            }
            if (expires_in) {
                dispatch(setTokenExpiryDate(+expires_in));
            }
        } else if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
            if (!siteInitialized) {
                dispatch(initializeSite(token));
            }
            if (tokenExpiryDate !== '') {
                const unixTimeNow = new Date().getTime();
                const tenMinMilliseconds = 600000;
                const oneDayMilliseconds = 86400000;
                const unixTimeExpiry = Date.parse(tokenExpiryDate);
                if (unixTimeNow > unixTimeExpiry + oneDayMilliseconds) {
                    dispatch(setLoggedOff());
                } else if (unixTimeNow > unixTimeExpiry - tenMinMilliseconds) {
                    dispatch(setAccessToken(''));
                    window.open(getAuthorizeHref(), '_self');
                }
            }
        } else {
            dispatch(setLoggedOff());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                main: pink[400],
                dark: pink[700]
            },
            type: thememode
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
            type: thememode
        }
    });

    const classes = useStyles();

    if (!loggedIn || (!token && !accessToken && !tokenExpiryDate)) {
        return <Redirect push to='/login' />
    }
    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <AppBarView />
            <div className='appBarSpace' />
            <div className={classes.verticalSpace} />
            <div className={classes.root}>
                <FestivalMatchSettingsBar />
                {isDbOnline &&
                    <FestivalMatchesDisplay />}
            </div>
            {!isDbOnline &&
                <div className={classes.root}>
                    <Typography variant="subtitle1" >
                        There seems to be some issue with connecting to our database. Try refreshing the page.
                    </Typography>
                </div>}
            <div hidden={!loaderOn} className='progressBar'>
                <MuiThemeProvider theme={indigoOrangeMuiTheme}>
                    <CircularProgress size={100} thickness={3} color={'secondary'} />
                </MuiThemeProvider>
            </div>
        </MuiThemeProvider>
    );
};

export default MainPage;
