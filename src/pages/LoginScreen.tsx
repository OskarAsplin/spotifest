import React, { useEffect } from 'react';
import { AppState, DispatchProps } from "../redux/types";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Box, Paper, Typography, Button, IconButton, Collapse, Link, PaletteType } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { setLoggedIn, setLoggedOff } from "../redux/actions";
import 'react-circular-progressbar/dist/styles.css';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import { isDev } from "../utils/restUtils";
import { lightBlue, pink } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 3, 0, 3),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        root1: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0, 4, 0, 4),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        background: {
            height: '100vh',
            backgroundImage: "url(/background_image.jpg), url(/background_image_low_res.jpg)",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
        },
        progressBar: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginTop: '-50px',
            marginLeft: '-50px'
        },
        verticalSpace: {
            display: 'flex',
            padding: theme.spacing(2, 0, 2, 0),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 610px)': {
                padding: theme.spacing(0, 4, 0, 4),
            },
            '@media (max-width: 609px)': {
                padding: theme.spacing(0, 2, 0, 2),
            },
            justifyContent: 'space-between',
        },
        paddingBottom: {
            paddingBottom: theme.spacing(2),
            width: '100%'
        },
        button: {
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
            //borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            boxShadow: '0 0 2rem rgba(0, 0, 1)',
            "&:hover": {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }
        },
        rowFlex: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        box: {
            maxWidth: '1112px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        box2: {
            width: '95%',
            maxWidth: '663px'
        },
        title: {
            '@media (max-width: 357px)': {
                maxWidth: '220px'
            },
            textAlign: 'center',
            borderRadius: '15%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0 0 2rem rgba(0, 0, 0, 1)',
        },
        footerBox: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        footer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '@media (min-width: 610px)': {
                maxWidth: '1112px',
            },
            '@media (max-width: 609px)': {
                maxWidth: '95%',
            },
            margin: theme.spacing(0, 4, 0, 4),
        },
        footerRight: {
            display: 'flex',
            width: '100%',
            '@media (min-width: 610px)': {
                flexDirection: 'row-reverse',
                paddingRight: theme.spacing(1)
            },
            '@media (max-width: 609px)': {
                justifyContent: 'center'
            },
            margin: theme.spacing(1),
        },
        expand: {
            transform: 'rotate(180deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(0deg)',
        },
        attributionShadow: {
            textAlign: 'center',
            borderRadius: '15%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0 0 5rem rgba(0, 0, 0, 1)',
        },
    }),
);

interface StoreProps {
    thememode: PaletteType
}

type Props = DispatchProps & StoreProps;

const authEndpoint = 'https://accounts.spotify.com/authorize';


const clientId = '***REMOVED***';
const redirectUri = isDev() ? 'http://localhost:3000' : 'https://www.spotifest.app';
const scopes = [
    'user-read-private',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
];

export const authorizeHref = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token`;

const LoginScreen: React.FC<Props> = (props: Props) => {

    const bigWidth = useMediaQuery('(min-width:610px)');
    const bigHeight = useMediaQuery('(min-height:500px)');
    const bigScreen = bigWidth && bigHeight;
    const { thememode } = props;
    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        props.dispatch(setLoggedOff());
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
                main: pink[500],
                dark: pink[700]
            },
            type: thememode
        }
    });

    const classes = useStyles();

    return (
        //<SplashScreen>
        <div className={classes.background}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <div className={classes.verticalSpace} />
                <div className={classes.verticalSpace} />

                <div className={classes.root}>
                    <Box className={classes.box}>
                        <Typography variant={bigScreen ? "h2" : "h4"} className={classes.title}>
                            Oskarito SpotiFest
                        </Typography>
                    </Box>
                </div>
                <div className={classes.root1}>
                    <div className={classes.verticalSpace} />
                    {!(bigWidth && !bigHeight) &&
                        <div className={classes.verticalSpace} />}
                    {!(bigWidth && !bigHeight) &&
                        <div className={classes.verticalSpace} />}
                    <Box className={classes.box2}>
                        <Button className={classes.button} key={'Login to spotify button'}
                            variant="outlined"
                            onClick={() => {
                                props.dispatch(setLoggedIn());
                                window.open(authorizeHref, '_self');
                            }}>
                            <Typography variant={bigScreen ? "h4" : "h6"}>
                                Log in with Spotify to see your festival matches
	                        </Typography>
                        </Button>
                    </Box>
                    <Box className={classes.footerBox}>
                        <Box className={classes.footer}>
                            <Paper className={classes.paper} key={'disclaimer paper'}>
                                <div className={classes.rowFlex}>
                                    <Typography variant={"subtitle2"} onClick={() => setExpanded(!expanded)}>
                                        Disclaimer
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
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <div className={classes.paddingBottom}>
                                        This website was made with the intention of inspiring people to attend festivals to their liking.
                                        It was made by a simple minded Norwegian guy wanting to do some good in the world.
                                        This Norwegian guy takes no responsibility for any inaccuracies in the information on the site, as this is purely a hobby project at this point.
                                        Special thanks to Spotify and MusicFestivalWizard for their available information about artists and festivals, making this site possible to make.
        		                    </div>
                                </Collapse>
                            </Paper>
                        </Box>
                        <Box className={classes.footerRight}>
                            <div className={classes.attributionShadow}>
                                <Link color={'primary'}
                                    href="https://www.flickr.com/photos/149801000@N05/34735177654/in/photostream/"
                                    target={"_blank"}
                                    rel="noopener noreferrer">
                                    Photo
                                </Link> by <Link color={'primary'}
                                    href="https://www.flickr.com/photos/149801000@N05/"
                                    target={"_blank"}
                                    rel="noopener noreferrer">
                                    veldmusicfestival
                                </Link> / <Link color={'primary'}
                                    href="https://creativecommons.org/licenses/by-sa/2.0/"
                                    target={"_blank"}
                                    rel="noopener noreferrer">
                                    CC BY-SA 2.0
                                </Link>
                            </div>
                        </Box>
                    </Box>
                </div>
            </MuiThemeProvider>
        </div>
        //</SplashScreen>
    );
};

const mapStateToProps = (state: AppState) => ({
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
)(LoginScreen);
