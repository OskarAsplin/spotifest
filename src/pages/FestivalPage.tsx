import React, { useEffect } from 'react';
import { AppState, DispatchProps, FestivalInfo } from "../redux/types";
import { turnOnLoader, turnOffLoader } from "../redux/actions";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Typography, Paper, Box, Link, Button, Tabs, Tab, PaletteType, Switch, useTheme } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { deepOrange, indigo, lightBlue, pink } from "@material-ui/core/colors";
import { Model } from "../redux/types";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
import { fetchToJson } from "../utils/restUtils";
import ArtistBubble from './parts/ArtistBubble';
import SwipeableViews from 'react-swipeable-views';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 2, 0, 2),
            alignItems: 'center',
            width: '100%'
        },
        paper: {
            display: 'flex',
            '@media (min-width: 500px)': {
                padding: theme.spacing(2, 4, 2, 4),
                flexDirection: 'row',
            },
            '@media (max-width: 499px)': {
                padding: theme.spacing(2, 2, 2, 2),
                flexDirection: 'column',
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
        box: {
            width: '100%',
            maxWidth: '1112px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        videoBox: {
            margin: theme.spacing(0, 2, 2, 2),
        },
        flexColumn: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 500px)': {
                maxWidth: '50%'
            },
        },
        buttonBox: {
            '@media (min-width: 500px)': {
                maxWidth: '50%'
            },
            display: 'flex',
            alignItems: 'center',
        },
        festivalImg: {
            maxHeight: 400,
            maxWidth: '100%',
        },
        tabs: {
            maxWidth: '90%'
        },
        lineupView: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        artistsView: {
            display: 'flex',
            flexDirection: 'row',
        },
        artistAvatarBox: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },
        lineupBox: {
            display: 'flex',
            alignItems: 'center',
            marginTop: theme.spacing(2)
        },
        lineup: {
            maxHeight: 450,
            '@media (min-width: 500px)': {
                maxWidth: 450,
            },
            '@media (max-width: 499px)': {
                maxWidth: 300,
            },
        },
        tabLabel: {
            fontSize: '20px',
        },
        sortButtonBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        button: {
            textTransform: 'none',
            padding: theme.spacing(0),
            fontSize: '18px',
            "&:hover": {
                backgroundColor: "transparent",
            }
        },
        invisibleButton: {
            display: 'none'
        },
        align: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        tabPanel: {
            padding: theme.spacing(2, 1, 2, 1)
        },
        tabRoot: {
            '@media (min-width: 900px)': {
                minWidth: '160px',
            },
            '@media (min-width: 500px)': {
                '@media (max-width: 899px)': {
                    minWidth: '100px',
                },
            },
            '@media (max-width: 499px)': {
                minWidth: '72px',
            },
        },
        festivalTitle: {
            '@media (max-width: 499px)': {
                textAlign: 'center'
            },
        },
    }),
);

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

interface StoreProps {
    model: Model,
    thememode: PaletteType
}

type Props = DispatchProps & StoreProps;

const FestivalPage: React.FC<Props> = (props: Props) => {

    const bigScreen = useMediaQuery('(min-width:500px)');

    useEffect(() => {
        let festival = window.location.search.substring(1);
        props.dispatch(turnOnLoader());
        fetchToJson('http://127.0.0.1:8000/onTour/festivalInfo/?q=' + festival)
            .then((response: any) => {
                setFestivalInfo(response as FestivalInfo);
            }).catch((error) => {
                console.log(error);
                if (error instanceof TypeError) {
                    setIsNetworkError(true);
                } else {
                    setIsFestivalInDb(false);
                }
            }).finally(() => props.dispatch(turnOffLoader()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { thememode } = props;
    const [festivalInfo, setFestivalInfo] = React.useState<FestivalInfo | undefined>(undefined);
    const [isFestivalInDb, setIsFestivalInDb] = React.useState(true);
    const [isNetworkError, setIsNetworkError] = React.useState(false);
    const [selectedLineup, setSelectedLineup] = React.useState(0);
    const [sortAlphabetically, setSortAlphabetically] = React.useState(false);

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
            type: thememode
        }
    });

    const classes = useStyles();
    const theme = useTheme();

    const TabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box className={classes.tabPanel}>{children}</Box>}
            </Typography>
        );
    }

    if (!festivalInfo) {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <AppBarView birghtnessSwitchEnabled={true} accountCircleEnabled={true} />
                <div className={classes.align}>
                    <div className={classes.verticalSpace} />
                    <div className={classes.verticalSpace} />
                    {isNetworkError &&
                        <Typography variant="subtitle1" >
                            There seems to be some issue with connecting to our database. Try refreshing the page.
                        </Typography>
                    }
                    {!isNetworkError && !isFestivalInDb &&
                        <Typography variant="subtitle1" >
                            Could not find festival.
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
                <AppBarView birghtnessSwitchEnabled={true} accountCircleEnabled={true} />
                <div className={classes.verticalSpace} />

                <div className={classes.root}>
                    <Box className={classes.box}>
                        <Paper elevation={10} className={classes.paper} key={'festivalInfo:' + festivalInfo.name}>
                            <div className={classes.flexColumn}>
                                <Typography variant={bigScreen ? "h2" : "h4"} className={classes.festivalTitle}>
                                    {festivalInfo.name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {festivalInfo.locationText}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {'Genres: ' + festivalInfo.genres.slice(0, 5).join(", ")}
                                </Typography>
                                {festivalInfo.webpage &&
                                    <Link color={'secondary'} variant="subtitle1" href={festivalInfo.webpage}
                                        rel="noopener noreferrer" target="_blank">
                                        Official webpage
                                    </Link>}
                                {festivalInfo.ticketWebpage &&
                                    <Link color={'secondary'} variant="subtitle1" href={festivalInfo.ticketWebpage}
                                        rel="noopener noreferrer" target="_blank">
                                        Ticket webpage
                                    </Link>}
                                {festivalInfo.crawledWebpage &&
                                    <Link color={'secondary'} variant="subtitle1" href={festivalInfo.crawledWebpage}
                                        rel="noopener noreferrer" target="_blank">
                                        View on Musicfestivalwizard.com
                                    </Link>}
                            </div>
                            <Box className={classes.buttonBox}>
                                <Button onClick={() => window.open(festivalInfo.festivalImg, '_blank')}>
                                    <img className={classes.festivalImg} src={festivalInfo.festivalImg} alt="" />
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                    <div className={classes.verticalSpace} />
                    {festivalInfo.video &&
                        <Box className={classes.videoBox}>
                            <Paper elevation={3} className={classes.paper} key={'festival video:' + festivalInfo.name}>
                            <iframe width={bigScreen ? '420' : '328'} height={bigScreen ? '315' : '246'} title={'festival video iframe:' + festivalInfo.name}
                                    src={festivalInfo.video}>
                                    }
                                </iframe>
                            </Paper>
                        </Box>
                    }
                    {festivalInfo.lineups.length !== 0 &&
                        <Box className={classes.box}>
                            <MuiThemeProvider theme={lightBluePinkMuiTheme}>
                                <Paper elevation={3} className={classes.paper2} key={'festival video:' + festivalInfo.name}>
                                    <Tabs
                                        centered
                                        value={selectedLineup}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        onChange={(event: React.ChangeEvent<{}>, newValue: number) => setSelectedLineup(newValue)}
                                        aria-label="lineups"
                                    >
                                        {festivalInfo.lineups.map((lineup, idx) =>
                                            <Tab label={<span className={classes.tabLabel}>{lineup.year}</span>} value={idx}
                                            key={'tab: ' + festivalInfo.name + lineup.year} classes={{ root: classes.tabRoot }}/>)}
                                    </Tabs>
                                    <SwipeableViews
                                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                        index={selectedLineup}
                                        onChangeIndex={(newValue: number) => setSelectedLineup(newValue)}
                                    >
                                    {festivalInfo.lineups.map((lineup, idx) =>
                                        <TabPanel value={selectedLineup} index={idx} key={'tabPanel: ' + festivalInfo.name + lineup.year}>
                                            <Box className={classes.lineupView}>
                                                {lineup.cancelled ?
                                                    <Typography variant="h5" color='secondary'>
                                                        {'CANCELLED' + (lineup.date_str ? ' (' + lineup.date_str + ')' : '')}
                                                    </Typography> :
                                                    <Typography variant="h5">
                                                        {lineup.date_str}
                                                    </Typography>}
                                                <Box className={classes.sortButtonBox}>
                                                    {/* The invisible button is a quick fix for click event propagation from the grid item */}
                                                    <Button hidden className={classes.invisibleButton}>.</Button>
                                                    <Button disableRipple disableElevation className={classes.button}
                                                        color={!sortAlphabetically ? 'primary' : 'default'}
                                                        onClick={() => setSortAlphabetically(false)}>
                                                        Popularity
                                                    </Button>
                                                    <Switch checked={sortAlphabetically} color="default"
                                                        onChange={(evt: any) => setSortAlphabetically(evt.target.checked ? true : false)}
                                                        name="switchSortAlphabetically" />
                                                    <Button disableRipple disableElevation className={classes.button}
                                                        color={sortAlphabetically ? 'primary' : 'default'}
                                                        onClick={() => setSortAlphabetically(true)}>
                                                        Alphabetically
                                                    </Button>
                                                </Box>
                                                <Box className={classes.artistsView}>
                                                    <div className={classes.artistAvatarBox}>
                                                        {lineup.artists.length > 0 &&
                                                            lineup.artists.sort((a, b) => (sortAlphabetically ?
                                                                (a.name > b.name) :
                                                                (a.popularity < b.popularity)) ? 1 : -1)
                                                                .map((artist) => (
                                                                    <ArtistBubble
                                                                        artist={artist}
                                                                        key={'avatar_festival_lineup_artist_' + festivalInfo.name + lineup.year + artist.name}
                                                                        thememode={thememode} />
                                                                )
                                                                )}
                                                    </div>
                                                </Box>
                                                {lineup.poster && <div className={classes.lineupBox}>
                                                    <Button onClick={() => window.open(lineup.poster, '_blank')}>
                                                        <img className={classes.lineup} src={lineup.poster} alt="" />
                                                    </Button>
                                                </div>}
                                            </Box>
                                        </TabPanel>)}
                                    </SwipeableViews>
                                </Paper>
                            </MuiThemeProvider>
                        </Box>
                    }
                </div>
                <div hidden={!loaderOn} className={classes.progressBar}>
                    <CircularProgress size={100} thickness={3} color={'secondary'} />
                </div>

            </MuiThemeProvider>
        );
    }
};

const mapStateToProps = (state: AppState) => ({
    model: state.model,
    thememode: state.model.thememode
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FestivalPage);
