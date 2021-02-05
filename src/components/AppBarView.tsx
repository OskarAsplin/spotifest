import { IconButton, Typography, Toolbar, AppBar, Avatar, Popover, Link, MuiThemeProvider, Button } from '@material-ui/core';
import { InputAdornment, TextField, Paper, Box, CircularProgress, ClickAwayListener, Drawer, Slide } from '@material-ui/core';
import { useScrollTrigger, PaletteType, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { lightBlue, blueGrey } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import { Brightness2, Brightness4 } from "@material-ui/icons";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from "@material-ui/icons/Search";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useAsync } from 'react-async-hook';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import useConstant from 'use-constant';
import { selectLoggedIn, setLoggedOff } from '../redux/reducers/authorizationSlice';
import { selectThememode, switchToDarkMode, switchToLightMode } from '../redux/reducers/displaySlice';
import { selectUserInfo } from '../redux/reducers/spotifyAccountSlice';
import { UserInfo, SearchResponse } from "../redux/types";
import { fetchToJson, getApiBaseUrl } from "../utils/restUtils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        },
        grow: {
            flexGrow: 1,
        },
        customizeToolbar: {
            minHeight: 36,
            '@media (max-width: 439px)': {
                padding: theme.spacing(0, 1, 0, 1)
            },
        },
        profileImg: {
            height: 28,
            width: 28,
        },
        popover: {
            padding: theme.spacing(1.5),
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            alignItems: 'center',
        },
        bottomMargin: {
            marginBottom: theme.spacing(1),
        },
        button: {
            textTransform: 'none',
        },
        fullWidth: {
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center'
        },
        flexColumn: {
            display: 'flex',
            flexDirection: 'column'
        },
        fixed: {
            position: 'absolute',
            '@media (min-width: 610px)': {
                width: '250px'
            },
            '@media (max-width: 609px)': {
                width: '200px'
            },
            padding: theme.spacing(1, 1, 1, 1)
        },
        fixedAndAligned: {
            position: 'fixed',
            '@media (min-width: 610px)': {
                width: '250px'
            },
            '@media (max-width: 609px)': {
                width: '200px'
            },
            display: 'flex',
            padding: theme.spacing(1, 1, 1, 1),
            alignItems: 'center',
            justifyContent: 'center',
        },
        searchBarMarginTop: {
            marginTop: theme.spacing(6)
        },
        fixedWidthAbsolute: {
            '@media (min-width: 610px)': {
                width: '250px'
            },
            '@media (max-width: 609px)': {
                position: 'absolute',
                minHeight: '40px',
                width: '200px'
            },
            '@media (min-width: 590px)': {
                '@media (max-width: 609px)': {
                    marginRight: '44px'
                },
            },
            '@media (min-width: 440px)': {
                '@media (max-width: 589px)': {
                    marginRight: '36px'
                },
            },
            '@media (max-width: 439px)': {
                marginRight: '28px'
            },
        },
        marginTop: {
            marginTop: theme.spacing(2)
        },
        negativeMarginTop: {
            marginTop: -theme.spacing(1)
        },
        marginBottom: {
            marginBottom: theme.spacing(1)
        },
        fullWidthAndReverse: {
            right: 0,
            zIndex: 10,
            width: '100%',
            display: 'flex',
            flexDirection: 'row-reverse',
            position: 'fixed',
        },
        minHeight: {
            minHeight: '40px',
        },
        marginLeft: {
            '@media (min-width: 610px)': {
                marginLeft: theme.spacing(2),
            },
        },
        profilePicture: {
            '@media (min-width: 610px)': {
                marginLeft: theme.spacing(2),
            },
            padding: '10px'
        },
        drawerList: {
            width: 250,
        },
    }),
);

const emptySearchResponse: SearchResponse = { festivals: [], artists: [] };

// Generic reusable hook
const useDebouncedSearch = (searchFunction: any) => {

    // Handle the input text state
    const [inputText, setInputText] = useState('');

    // Debounce the original search async function
    const debouncedSearchFunction = useConstant(() =>
        AwesomeDebouncePromise(searchFunction, 700)
    );

    // The async callback is run each time the text changes,
    // but as the search function is debounced, it does not
    // fire a new request on each keystroke
    const searchResults = useAsync(
        async () => {
            if (inputText.length === 0) {
                return emptySearchResponse;
            } else {
                return debouncedSearchFunction(inputText);
            }
        },
        [debouncedSearchFunction, inputText]
    );

    // Return everything needed for the hook consumer
    return {
        inputText,
        setInputText,
        searchResults,
    };
};

const AppBarView = () => {
    const bigScreen = useMediaQuery('(min-width:610px)');
    const smallMobileScreen = useMediaQuery('(max-width:355px)');

    const thememode: PaletteType = useSelector(selectThememode);
    const loggedIn: boolean = useSelector(selectLoggedIn);
    const userInfo: UserInfo | undefined = useSelector(selectUserInfo);
    const dispatch = useDispatch();

    const useSearchDb = () => useDebouncedSearch((text: any) => searchDatabase(text))

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { inputText, setInputText, searchResults } = useSearchDb();
    const [searchBlur, setSearchBlur] = useState([false, false]);
    const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [redirectAboutPage, setRedirectAboutPage] = useState(false);

    const trigger = useScrollTrigger({ threshold: 30 });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchBlur = (num: number, isBlur: boolean) => {
        searchBlur[num] = isBlur;
        if (searchBlur[0] && (searchBlur[1] || !searchResults.result || searchResults.result === emptySearchResponse)) {
            setInputText('');
            setSearchBlur([false, false]);
            setTimeout(() => setShowSearchFieldSmallScreen(false), 100);
        } else {
            setSearchBlur(searchBlur);
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    const lightBluePinkMuiTheme = createMuiTheme({
        typography: {
            fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
        },
        palette: {
            primary: {
                light: lightBlue[300],
                main: lightBlue[500],
                dark: lightBlue[700],
            },
            secondary: {
                light: blueGrey[700],
                main: thememode === 'dark' ? blueGrey[800] : blueGrey[700],
                dark: blueGrey[900],
            },
            type: thememode
        }
    });

    const lightBluePinkDarkMuiTheme = createMuiTheme({
        typography: {
            fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
        },
        palette: {
            primary: {
                light: lightBlue[300],
                main: lightBlue[500],
                dark: lightBlue[700],
            },
            secondary: {
                light: blueGrey[700],
                main: thememode === 'dark' ? blueGrey[800] : blueGrey[700],
                dark: blueGrey[900],
            },
            background: {
                paper: '#FFFFFF',
            },
            text: {
                secondary: 'rgba(0, 0, 0, 0.87)'
            },
            type: 'dark'
        }
    });

    const searchDatabase = (searchString: string) => {
        return fetchToJson(getApiBaseUrl() + '/onTour/search/?q=' + searchString)
            .then((response: any) => {
                const searchResponse = (response as SearchResponse);
                return searchResponse;
            }).catch((error) => {
                console.log(error);
                return emptySearchResponse;
            });
    }

    const getBaseUrl = () => {
        const url = window.location.href;
        const spotifest_pos = url.search('spotifest.app');
        if (spotifest_pos !== -1) {
            return url.slice(0, spotifest_pos) + 'spotifest.app';
        } else {
            const localhost_pos = url.search('localhost:3000');
            return url.slice(0, localhost_pos) + 'localhost:3000';
        }
    }

    const getFestivalUrl = (festivalName: string) => {
        return getBaseUrl() + '/festival/' + encodeURIComponent(festivalName);
    }

    const getArtistUrl = (artistName: string) => {
        return getBaseUrl() + '/artist/' + encodeURIComponent(artistName);
    }

    const getSearchFieldAndResults = () => {
        return (<div className={classes.flexColumn}>
            {!bigScreen && <div className={classes.minHeight} />}
            <MuiThemeProvider theme={lightBluePinkDarkMuiTheme}>
                <TextField
                    variant="outlined"
                    size="small"
                    autoFocus={bigScreen ? false : true}
                    className={classes.fixedWidthAbsolute}
                    placeholder="Search"
                    value={inputText}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInputText(event.target.value)}
                    onBlur={() => handleSearchBlur(0, true)}
                    onFocus={() => { handleSearchBlur(0, false); setTimeout(() => handleSearchBlur(1, false), 200); }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={bigScreen ? {
                        endAdornment: (
                            <InputAdornment position="end" disablePointerEvents>
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    } : {}}
                />
                <div>
                    {searchResults.loading &&
                        <ClickAwayListener onClickAway={() => handleSearchBlur(1, true)}>
                            <Paper elevation={10} className={classes.fixedAndAligned}>
                                <CircularProgress />
                            </Paper>
                        </ClickAwayListener>}
                    {searchResults.error && <div>Error: {searchResults.error.message}</div>}
                    {searchResults.result && inputText && (
                            <ClickAwayListener onClickAway={() => handleSearchBlur(1, true)}>
                                <Paper elevation={10} className={classes.fixed}>
                                    <div className={classes.flexColumn}>
                                    {searchResults.result.festivals.length === 0 && searchResults.result.artists.length === 0 &&
                                            <Typography color='secondary' component="div">
                                                No results
                                            </Typography>}
                                        {searchResults.result.festivals.length > 0 &&
                                            <Typography className={classes.marginBottom} color='secondary' component="div">
                                                <Box fontWeight="fontWeightBold">Festivals:</Box>
                                            </Typography>}
                                        {searchResults.result.festivals.slice(0, 5).map((festival: any) => (
                                            <Link color={'textSecondary'}
                                                key={'searchResult festival: ' + festival.name}
                                                href={getFestivalUrl(festival.name)}
                                                onClick={() => setInputText('')}
                                                className={classes.bottomMargin}>
                                                {festival.name + ': ' + festival.location}
                                            </Link>
                                        ))}
                                        {searchResults.result.festivals.length > 5 && <Typography color='secondary' variant='subtitle1' className={classes.negativeMarginTop}>...</Typography>}
                                        {searchResults.result.festivals.length > 0 && searchResults.result.artists.length > 0 && <div className={classes.marginTop} />}
                                        {searchResults.result.artists.length > 0 &&
                                            <Typography className={classes.marginBottom} color='secondary' component="div">
                                                <Box fontWeight="fontWeightBold">Artists:</Box>
                                            </Typography>}
                                        {searchResults.result.artists.slice(0, 5).map((artist: any) => (
                                            <Link color={'textSecondary'}
                                                key={'searchResult artist: ' + artist.name}
                                                href={getArtistUrl(artist.name)}
                                                onClick={() => setInputText('')}
                                                className={classes.bottomMargin}>
                                                {artist.name}
                                            </Link>
                                        ))}
                                        {searchResults.result.artists.length > 5 && <Typography color='secondary' variant='subtitle1' className={classes.negativeMarginTop}>...</Typography>}
                                    </div>
                                </Paper>
                            </ClickAwayListener>
                        )}
                </div>
            </MuiThemeProvider>
        </div>);
    }

    if (redirectAboutPage && !window.location.href.endsWith('/about')) {
        return <Redirect push to={'/about'} />
    }

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={lightBluePinkMuiTheme}>
                <Slide appear={false} direction="down" in={!trigger || inputText !== ''}>
                    <div>
                        <AppBar id="oskarito-appbar" color="secondary">
                            <Toolbar className={classes.customizeToolbar}>
                                <Button
                                    className={classes.button}
                                    color="inherit"
                                    onClick={() => {
                                        const url = window.location.href;
                                        if (url.endsWith('spotifest.app') || url.endsWith('spotifest.app/')
                                            || url.endsWith('localhost:3000') || url.endsWith('localhost:3000/')) {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else {
                                            window.open(getBaseUrl(), '_self');
                                        }
                                    }}
                                >
                                    <Typography variant="h6">
                                        {smallMobileScreen ? 'SpotiFest' : 'Oskarito SpotiFest'}
                                    </Typography>
                                </Button>
                                <div className={classes.grow}>
                                </div>
                                {bigScreen && getSearchFieldAndResults()}
                                {!bigScreen &&
                                    <MuiThemeProvider theme={lightBluePinkDarkMuiTheme}>
                                        <IconButton onClick={() => { setShowSearchFieldSmallScreen(!showSearchFieldSmallScreen); setInputText(''); }}>
                                            <SearchIcon />
                                        </IconButton>
                                    </MuiThemeProvider>}
                                <MuiThemeProvider theme={lightBluePinkDarkMuiTheme}>
                                    <IconButton
                                        color="inherit"
                                        aria-describedby={id}
                                        onClick={handleClick}
                                        className={userInfo?.profilePictureUrl ? classes.profilePicture : classes.marginLeft}
                                    >
                                        {userInfo?.profilePictureUrl ?
                                            <Avatar src={userInfo.profilePictureUrl} alt="" className={classes.profileImg} />
                                            : <AccountCircleIcon />}
                                    </IconButton>
                                </MuiThemeProvider>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <div className={classes.popover}>
                                        {userInfo?.displayName &&
                                            <Typography variant="body1" className={classes.bottomMargin}>
                                                {userInfo.displayName}
                                            </Typography>
                                        }
                                        {userInfo && userInfo.spotifyUrl &&
                                            <Link color={'primary'}
                                                href={userInfo.spotifyUrl}
                                                target={"_blank"}
                                                rel="noopener noreferrer"
                                                className={classes.bottomMargin}>
                                                View profile in Spotify
                                            </Link>}
                                        {loggedIn && < Link color={'primary'}
                                            href={`https://accounts.spotify.com/en/logout`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => dispatch(setLoggedOff())}>
                                            Log out
                                        </Link>}
                                    </div>
                                </Popover>
                                <IconButton
                                    color="inherit"
                                    onClick={toggleDrawer(true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        {showSearchFieldSmallScreen && <div className={classes.fullWidthAndReverse}>
                            <Paper className={clsx(classes.fixedWidthAbsolute, classes.searchBarMarginTop)} style={{ backgroundColor: thememode === 'dark' ? blueGrey[800] : blueGrey[700] }}>
                                {getSearchFieldAndResults()}
                            </Paper>
                        </div>}
                    </div>
                </Slide>
                <Drawer anchor={'right'} open={drawerOpen} onClose={toggleDrawer(false)}>
                    <div
                        className={classes.drawerList}
                        role="presentation"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        <List>
                            <ListItem button key='About' onClick={() => setRedirectAboutPage(true)}>
                                <ListItemIcon><InfoIcon /></ListItemIcon>
                                <ListItemText primary='About' />
                            </ListItem>
                            <ListItem button key='Brightness' onClick={() => {
                                thememode === 'light'
                                    ? dispatch(switchToDarkMode())
                                    : dispatch(switchToLightMode());
                            }}>
                                <ListItemIcon>{thememode === 'light' ? <Brightness2 /> : <Brightness4 />}</ListItemIcon>
                                <ListItemText primary='Brightness' />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
            </MuiThemeProvider>
        </div>
    );
};

export default AppBarView;
