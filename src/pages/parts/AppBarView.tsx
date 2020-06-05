import React, { useState } from 'react';
import { createStyles, makeStyles, Theme, createMuiTheme } from '@material-ui/core/styles';
import { IconButton, Typography, Toolbar, AppBar, Avatar, Popover, Link, MuiThemeProvider, Button, InputAdornment, TextField, Paper, Box, CircularProgress, ClickAwayListener } from '@material-ui/core';
import { Brightness2, Brightness4 } from "@material-ui/icons";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Model, AppState, DispatchProps, SearchResponse } from "../../redux/types";
import { connect } from "react-redux";
import { switchToDarkMode, switchToLightMode, setLoggedOff } from "../../redux/actions";
import { lightBlue, blueGrey } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import SearchIcon from "@material-ui/icons/Search";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import { useAsync } from 'react-async-hook';
import { fetchToJson } from "../../utils/restUtils";

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
            height: 24,
            width: 24,
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
        }
    }),
);

interface OwnProps {
    birghtnessSwitchEnabled: boolean,
    accountCircleEnabled: boolean
}

interface StoreProps {
    model: Model
}

type Props = OwnProps & StoreProps & DispatchProps;

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

    const useSearchDb = () => useDebouncedSearch((text: any) => searchDatabase(text))

    const classes = useStyles();
    const { dispatch } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { inputText, setInputText, searchResults } = useSearchDb();
    const [searchBlur, setSearchBlur] = useState([false, false]);
    const [showSearchFieldSmallScreen, setShowSearchFieldSmallScreen] = useState(false);

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
        return fetchToJson('http://127.0.0.1:8000/onTour/search/?q=' + searchString)
            .then((response: any) => {
                const searchResponse = (response as SearchResponse);
                return searchResponse;
            }).catch((error) => {
                console.log(error);
                return emptySearchResponse;
            });
    }

    const getFestivalUrl = (festival: string) => {
        const url = window.location.href;
        const ontour_pos = url.search('ontour');
        return url.slice(0, ontour_pos) + 'ontour/festival?' + encodeURIComponent(festival);
    }

    const getArtistUrl = (spotifyId: string) => {
        const url = window.location.href;
        const ontour_pos = url.search('ontour');
        return url.slice(0, ontour_pos) + 'ontour/artist?' + encodeURIComponent(spotifyId);
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
                                                href={getArtistUrl(artist.spotifyId)}
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

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={lightBluePinkMuiTheme}>
                <AppBar position="static" id="oskarito-appbar" color="secondary">
                    <Toolbar className={classes.customizeToolbar}>
                        <Button
                            className={classes.button}
                            color="inherit"
                            onClick={() => { window.open('http://localhost:3000/ontour', '_self') }}
                        >
                            <Typography variant="h6">
                                Oskarito SpotiFest
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
                        {props.accountCircleEnabled &&
                            <MuiThemeProvider theme={lightBluePinkDarkMuiTheme}>
                                <IconButton
                                    color="inherit"
                                    aria-describedby={id}
                                    onClick={handleClick}
                                    className={classes.marginLeft}
                                >
                                    {props.model.userInfo?.profilePictureUrl ?
                                        <Avatar src={props.model.userInfo.profilePictureUrl} alt="" className={classes.profileImg} />
                                        : <AccountCircleIcon />}
                                </IconButton>
                            </MuiThemeProvider>}
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
                        {props.birghtnessSwitchEnabled &&
                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    props.model.thememode === 'light'
                                        ? dispatch(switchToDarkMode())
                                        : dispatch(switchToLightMode());
                                }}
                            >
                                {props.model.thememode === 'light' ? <Brightness2 /> : <Brightness4 />}
                            </IconButton>}
                    </Toolbar>
                </AppBar>
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
