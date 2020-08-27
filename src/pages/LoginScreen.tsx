import React, { useEffect } from 'react';
import { DispatchProps } from "../redux/types";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Box, Typography, Button, Link } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { setLoggedIn, setLoggedOff } from "../redux/actions";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import clsx from 'clsx';
import { lightBlue } from "@material-ui/core/colors";
import { getAuthorizeHref } from '../oauthConfig';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 400px)': {
                padding: theme.spacing(0, 3, 0, 3),
            },
            '@media (max-width: 399px)': {
                padding: theme.spacing(0, 1, 0, 1),
            },
            justifyContent: 'center',
            alignItems: 'center',
            top: '15%',
            width: '100%',
        },
        root1: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 334px)': {
                padding: theme.spacing(0, 4, 0, 4),
            },
            '@media (max-width: 333px)': {
                padding: theme.spacing(0, 1, 0, 1),
            },
            justifyContent: 'center',
            alignItems: 'center',
            top: '40%',
            width: '100%',
        },
        background: {
            height: '100vh',
            backgroundImage: "url(/background_image.jpg), url(/background_image_low_res.jpg)",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
        },
        spotifyIconBig: {
            height: '50px',
            marginRight: theme.spacing(2)
        },
        spotifyIconSmall: {
            height: '35px',
            marginRight: theme.spacing(1.5)
        },
        button: {
            display: 'flex',
            flexDirection: 'row',
            textTransform: 'none',
            alignItems: 'center',
            backgroundColor: '#1DB954',
            boxShadow: theme.shadows[3],
            "&:hover": {
                backgroundColor: 'rgb(29, 185, 84)'
            }
        },
        buttonSizeBig: {
            padding: theme.spacing(2, 5, 2, 5),
            borderRadius: 15,
        },
        buttonSizeSmall: {
            padding: theme.spacing(1, 2.5, 1, 1.5),
            borderRadius: 25,
        },
        box: {
            maxWidth: '1112px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        box2: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '95%',
            '@media (min-width: 610px)': {
                maxWidth: '480px',
            },
            '@media (max-width: 609px)': {
                maxWidth: '280px'
            },
        },
        title: {
            textAlign: 'center',
            borderRadius: '15%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            '@media (min-width: 610px)': {
                '@media (min-height: 610px)': {
                    boxShadow: '0 -2px 20px 20px rgba(0, 0, 0, 0.4)',
                }
            },
            boxShadow: '0 -1px 10px 10px rgba(0, 0, 0, 0.4)',
            textShadow: '1px 1px 2px black'
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
        attributionShadow: {
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            marginBottom: theme.spacing(1),
            padding: theme.spacing(1, 2, 1, 2),
            boxShadow: '0 -1px 50px 50px rgba(0, 0, 0, 0.6)'
        },
        footerFontSize: {
            '@media (min-width: 610px)': {
                '@media (min-height: 610px)': {
                    fontSize: '1.25rem'
                }
            },
        }
    }),
);

type Props = DispatchProps;

const LoginScreen: React.FC<Props> = (props: Props) => {

    const bigWidth = useMediaQuery('(min-width:610px)');
    const bigHeight = useMediaQuery('(min-height:610px)');
    const bigScreen = bigWidth && bigHeight;
    const verySmallScreen = useMediaQuery('(max-width:330px)');

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
                light: '#fefefe',
                main: '#fefefe',
                dark: '#fefefe',
            },
            type: 'dark'
        }
    });

    const classes = useStyles();

    return (
        <div className={classes.background}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />

                <div className={classes.root}>
                    <Box className={classes.box}>
                        <Typography variant={bigScreen ? "h2" : verySmallScreen ? "h5" : "h4"} color={'secondary'} className={classes.title}>
                            Oskarito SpotiFest
                        </Typography>
                    </Box>
                </div>
                <div className={classes.root1}>
                    <Box className={classes.box2}>
                        <Button className={clsx(classes.button, bigScreen ? classes.buttonSizeBig : classes.buttonSizeSmall)} key={'Log in with spotify button'}
                            variant="contained"
                            onClick={() => {
                                props.dispatch(setLoggedIn());
                                window.open(getAuthorizeHref(), '_self');
                            }}>
                            <img src={process.env.PUBLIC_URL + '/techIcons/Spotify-Icon-White.png'}
                                className={bigScreen ? classes.spotifyIconBig : classes.spotifyIconSmall} alt="Spotify-icon" />
                            <Typography variant={bigScreen ? "h4" : "h6"} color={'secondary'}>
                                Log in with Spotify
	                        </Typography>
                        </Button>
                    </Box>
                </div>
                <Box className={clsx(classes.footerBox, classes.attributionShadow)}>
                    <Typography variant={bigScreen ? "body1" : "body2"} color={'secondary'} className={classes.footerFontSize}>
                        A festival finder created by <Link color={'primary'}
                            href={'https://github.com/OskarAsplin'}
                            target={"_blank"}
                            rel="noopener noreferrer">
                            Oskar Asplin
                            </Link>
                    </Typography>
                    <Typography variant={bigScreen ? "body1" : "body2"} color={'secondary'} className={classes.footerFontSize}>
                        Code on <Link color={'primary'}
                            href={'https://github.com/OskarAsplin/spotifest'}
                            target={"_blank"}
                            rel="noopener noreferrer">
                            GitHub
                            </Link>
                    </Typography>
                    <Typography variant={bigScreen ? "body1" : "body2"} color={'secondary'} className={classes.footerFontSize}>
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
                    </Typography>
                </Box>
            </MuiThemeProvider>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapDispatchToProps
)(LoginScreen);
