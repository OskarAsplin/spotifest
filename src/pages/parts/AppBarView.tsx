import React, { useState } from 'react';
import { createStyles, makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';
import { IconButton, Typography, Toolbar, AppBar, Avatar, Popover, Link, MuiThemeProvider, Button, InputAdornment, TextField, Paper, Box, CircularProgress, ClickAwayListener, Drawer } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Brightness2, Brightness4 } from "@material-ui/icons";
import { Model, AppState, DispatchProps, SearchResponse } from "../../redux/types";
import { connect } from "react-redux";
import { switchToDarkMode, switchToLightMode, setLoggedOff } from "../../redux/actions";
import { lightBlue, blueGrey } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from '@material-ui/icons/Info';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import { useAsync } from 'react-async-hook';
import { fetchToJson, getApiBaseUrl } from "../../utils/restUtils";
import { Redirect } from 'react-router-dom';

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
            minHeight: 36
        },
        profileImg: {
            height: 30,
            width: 30,
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
            position: 'absolute',
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
        fixedWidthAbsolute: {
            zIndex: 10,
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
            '@media (max-width: 589px)': {
                marginRight: '36px'
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
            width: '100%',
            display: 'flex',
            flexDirection: 'row-reverse'
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
            padding: '9px'
        },
        drawerList: {
            width: 250,
        },
    }),
);

interface StoreProps {
    model: Model
}

type Props = StoreProps & DispatchProps;

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

const AppBarView: React.FC<Props> = (props: Props) => {
    const bigScreen = useMediaQuery('(min-width:610px)');
    const smallMobileScreen = useMediaQuery('(max-width:355px)');

    const useSearchDb = () => useDebouncedSearch((text: any) => searchDatabase(text))

    const classes = useStyles();
    const { dispatch } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { inputText, setInputText, searchResults } = useSearchDb();
    const [searchBlur, setSearchBlur] = useState([false, false]);
    const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [redirectAboutPage, setRedirectAboutPage] = useState(false);

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
                main: props.model.thememode === 'dark' ? blueGrey[800] : blueGrey[700],
                dark: blueGrey[900],
            },
            type: props.model.thememode
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
                main: props.model.thememode === 'dark' ? blueGrey[800] : blueGrey[700],
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
        const url = window.location.href;
        const spotifest_pos = url.search('spotifest.app');
        if (spotifest_pos !== -1) {
            return url.slice(0, spotifest_pos) + 'spotifest.app/festival?' + encodeURIComponent(festivalName);
        } else {
            const localhost_pos = url.search('localhost:3000');
            return url.slice(0, localhost_pos) + 'localhost:3000/festival?' + encodeURIComponent(festivalName);
        }
    }

    const getArtistUrl = (artistName: string) => {
        const url = window.location.href;
        const spotifest_pos = url.search('spotifest.app');
        if (spotifest_pos !== -1) {
            return url.slice(0, spotifest_pos) + 'spotifest.app/artist?' + encodeURIComponent(artistName);
        } else {
            const localhost_pos = url.search('localhost:3000');
            return url.slice(0, localhost_pos) + 'localhost:3000/artist?' + encodeURIComponent(artistName);
        }
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
                    {searchResults.result &&
                        (searchResults.result.festivals.length > 0 || searchResults.result.artists.length > 0) && (
                            <ClickAwayListener onClickAway={() => handleSearchBlur(1, true)}>
                                <Paper elevation={10} className={classes.fixed}>
                                    <div className={classes.flexColumn}>
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
                <AppBar position="static" id="oskarito-appbar" color="secondary">
                    <Toolbar className={classes.customizeToolbar}>
                        <Button
                            className={classes.button}
                            color="inherit"
                            onClick={() => { window.open(getBaseUrl(), '_self') }}
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
                                className={props.model.userInfo?.profilePictureUrl ? classes.profilePicture : classes.marginLeft}
                            >
                                {props.model.userInfo?.profilePictureUrl ?
                                    <Avatar src={props.model.userInfo.profilePictureUrl} alt="" className={classes.profileImg} />
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
                                {props.model.userInfo?.displayName &&
                                    <Typography variant="body1" className={classes.bottomMargin}>
                                        {props.model.userInfo.displayName}
                                    </Typography>
                                }
                                {props.model.userInfo && props.model.userInfo.spotifyUrl &&
                                    <Link color={'primary'}
                                        href={props.model.userInfo.spotifyUrl}
                                        target={"_blank"}
                                        rel="noopener noreferrer"
                                        className={classes.bottomMargin}>
                                        View profile in Spotify
                                    </Link>}
                                {props.model.loggedIn && < Link color={'primary'}
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
                                props.model.thememode === 'light'
                                    ? dispatch(switchToDarkMode())
                                    : dispatch(switchToLightMode());
                            }}>
                                <ListItemIcon>{props.model.thememode === 'light' ? <Brightness2 /> : <Brightness4 />}</ListItemIcon>
                                <ListItemText primary='Brightness' />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
                {!bigScreen && showSearchFieldSmallScreen && <div className={classes.fullWidthAndReverse}>
                    <Paper className={classes.fixedWidthAbsolute} style={{ backgroundColor: props.model.thememode === 'dark' ? blueGrey[800] : blueGrey[700] }}>
                        {getSearchFieldAndResults()}
                    </Paper>
                </div>}
            </MuiThemeProvider>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    model: state.model,
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppBarView);
