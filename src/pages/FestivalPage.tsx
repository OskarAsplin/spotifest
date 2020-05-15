import React, { useEffect } from 'react';
import { AppState, DispatchProps, FestivalInfo } from "../redux/types";
import { turnOnLoader, turnOffLoader } from "../redux/actions";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Typography, Paper, Box, Link, Button, Tabs, Tab, PaletteType, Switch } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { deepOrange, indigo, lightBlue, pink } from "@material-ui/core/colors";
import { Model } from "../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import 'react-circular-progressbar/dist/styles.css';
import { fetchToJson } from "../utils/restUtils";
import ArtistBubble from './parts/ArtistBubble';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 4, 0, 4),
            alignItems: 'center',
            width: '100%'
        },
        paper: {
            display: 'flex',
            flexDirection: 'row',
            padding: theme.spacing(2, 4, 2, 4),
            justifyContent: 'space-between',
            width: '100%'
        },
        paper2: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 4, 2, 4),
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
            width: '90%',
            maxWidth: '1112px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        videoBox: {
            margin: theme.spacing(0, 2, 2, 2),
        },
        grow: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '50%'
        },
        buttonBox: {
            width: '50%',
            display: 'flex',
            alignItems: 'center',
        },
        festivalImg: {
            maxHeight: 400,
            maxWidth: '100%',
        },
        tabs: {
            flexGrow: 1,
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
            justifyContent: 'center'
        },
        lineupBox: {
            display: 'flex',
            alignItems: 'center',
            marginTop: theme.spacing(2)
        },
        lineup: {
            maxHeight: 450,
            maxWidth: 1000,
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
    }),
);

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
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
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

interface StoreProps {
    model: Model,
    thememode: PaletteType
}

type Props = DispatchProps & StoreProps;

const FestivalPage: React.FC<Props> = (props: Props) => {

    useEffect(() => {
        let festival = window.location.search.substring(1);
        props.dispatch(turnOnLoader());
        fetchToJson('http://127.0.0.1:8000/onTour/festivalInfo/?q=' + festival)
            .then((festivalInfo: any) => {
                setFestivalInfo(festivalInfo as FestivalInfo);
                props.dispatch(turnOffLoader());
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { thememode } = props;
    const [festivalInfo, setFestivalInfo] = React.useState<FestivalInfo | undefined>(undefined);
    const [selectedLineup, setSelectedLineup] = React.useState(0);
    const [sortAlphabetically, setSortAlphabetically] = React.useState(false);

    const handleSelectedLineupChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedLineup(newValue);
    };

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

    if (!festivalInfo) {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <AppBarView />
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
                        <Paper elevation={10} className={classes.paper} key={'festivalInfo:' + festivalInfo.name}>
                            <div className={classes.grow}>
                                <Typography variant="h2">
                                    {festivalInfo.name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {festivalInfo.locationText}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {'Genres: ' + festivalInfo.genres.slice(0, 5).join(", ")}
                                </Typography>
                                {festivalInfo.webpage &&
                                    <Link color={'secondary'} variant="subtitle1" href={festivalInfo.webpage}>
                                        Official webpage
                                    </Link>}
                                {festivalInfo.ticketWebpage &&
                                    <Link color={'secondary'} variant="subtitle1" href={festivalInfo.ticketWebpage}>
                                        Ticket webpage
                                    </Link>}
                                {festivalInfo.crawledWebpage &&
                                    <Link color={'secondary'} variant="subtitle1" href={festivalInfo.crawledWebpage}>
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
                    {festivalInfo.video &&
                        <Box className={classes.videoBox}>
                            <Paper elevation={3} className={classes.paper} key={'festival video:' + festivalInfo.name}>
                            <iframe width="420" height="315" title={'festival video iframe:' + festivalInfo.name}
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
                                        value={selectedLineup}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        onChange={handleSelectedLineupChange}
                                        aria-label="lineups"
                                    >
                                    {festivalInfo.lineups.map((lineup, idx) =>
                                        <Tab label={<span className={classes.tabLabel}>{lineup.year}</span>} value={idx} key={'tab: ' + festivalInfo.name + lineup.year} />)}
                                    </Tabs>
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
