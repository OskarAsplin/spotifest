import React from 'react';
import { AppState, DispatchProps } from "../redux/types";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Box, Paper, Typography, Link, IconButton, Collapse, List, ListItem, ListItemIcon, ListItemText, Grid, PaletteType, Button } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import { lightBlue, pink, blueGrey } from "@material-ui/core/colors";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import ArrowBackOutlined from '@material-ui/icons/ArrowBack';
import MusicNote from '@material-ui/icons/MusicNote';
import { Redirect } from 'react-router-dom';

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
            padding: theme.spacing(1, 0, 0, 0),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        verticalSpace2: {
            display: 'flex',
            padding: theme.spacing(4, 0, 0, 0),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 610px)': {
                padding: theme.spacing(1, 4, 1, 4),
            },
            '@media (max-width: 609px)': {
                padding: theme.spacing(1, 2, 1, 2),
            },
            justifyContent: 'center',
            alignItems: 'center',
        },
        maxWidth400: {
            width: '100%',
            maxWidth: '400px'
        },
        minWidth650: {
            '@media (min-width: 700px)': {
                minWidth: '650px'
            },
            '@media (max-width: 699px)': {
                width: '100%'
            },
        },
        box: {
            '@media (max-width: 699px)': {
                width: '100%'
            },
            maxWidth: '1000px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        box2: {
            width: '100%',
            maxWidth: '1000px',
            margin: theme.spacing(0, 2, 2, 2),
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
        },
        flexColumn: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        textAlign: {
            '@media (max-width: 609px)': {
                textAlign: 'center'
            },
        },
        title: {
            '@media (max-width: 609px)': {
                textAlign: 'center'
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '48px'
        },
        topLeft: {
            position: 'absolute',
            top: theme.spacing(8),
            left: theme.spacing(2),
        },
        circleIconLight: {
            background: blueGrey[300],
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        circleIconDark: {
            background: blueGrey[700],
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        rowFlexCenter: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        rowFlex: {
            display: 'flex',
            '@media (min-width: 1040px)': {
                flexDirection: 'row',
            },
            '@media (max-width: 1039px)': {
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
        expandedDiv: {
            paddingBottom: theme.spacing(2),
            paddingTop: theme.spacing(2),
            width: '100%'
        },
        full: {
            height: '40px',
            '@media (min-width: 500px)': {
                marginLeft: theme.spacing(5),
            },
            '@media (max-width: 499px)': {
                marginLeft: theme.spacing(3),
            },
            '@media (max-width: 1039px)': {
                marginBottom: theme.spacing(5),
            },
        },
        fullFirst: {
            height: '40px',
            '@media (min-width: 1040px)': {
                marginLeft: theme.spacing(5),
            },
            '@media (max-width: 1039px)': {
                marginBottom: theme.spacing(5),
            },
        },
        leftMargin: {
            '@media (min-width: 500px)': {
                marginLeft: theme.spacing(5),
            },
            '@media (max-width: 499px)': {
                marginLeft: theme.spacing(3),
            },
        },
        fullNginx: {
            '@media (min-width: 500px)': {
                marginLeft: theme.spacing(5),
                height: '32px',
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1),
            },
            '@media (max-width: 499px)': {
                marginLeft: theme.spacing(3),
                height: '23px',
            },
            '@media (max-width: 1039px)': {
                marginBottom: theme.spacing(5),
            },
        },
        fullDjango: {
            height: '40px',
            '@media (min-width: 500px)': {
                marginLeft: theme.spacing(3),
            },
            '@media (max-width: 499px)': {
                marginLeft: theme.spacing(1),
            },
            '@media (max-width: 1039px)': {
                marginBottom: theme.spacing(5),
            },
        },
        fullFirstMedium: {
            '@media (min-width: 500px)': {
                height: '40px',
            },
            '@media (max-width: 499px)': {
                height: '35px',
            },
            '@media (min-width: 1040px)': {
                marginLeft: theme.spacing(5),
            },
            '@media (max-width: 1039px)': {
                marginBottom: theme.spacing(5),
            },
        },
        fullLastRow: {
            '@media (min-width: 500px)': {
                height: '40px',
            },
            '@media (max-width: 499px)': {
                height: '35px',
            },
            '@media (min-width: 1040px)': {
                marginLeft: theme.spacing(5),
            },
        },
        fullNoMargin: {
            height: '40px',
        },
        lightBackground: {
            background: '#e0e0e0',
        },
        width40marginLeft: {
            width: '40px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '@media (min-width: 1040px)': {
                marginLeft: theme.spacing(5),
            },
            '@media (max-width: 1039px)': {
                marginBottom: theme.spacing(5),
            },
        },
        flexEnd: {
            display: 'flex',
            '@media (min-width: 1040px)': {
                flexDirection: 'row-reverse',
            },
            '@media (max-width: 1039px)': {
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
        creatorImage: {
            '@media (min-width: 610px)': {
                marginTop: theme.spacing(3),
            },
            '@media (max-width: 609px)': {
                marginTop: theme.spacing(2),
            },
            marginBottom: theme.spacing(1),
            width: '90%',
            borderRadius: '5%',
        },
        fullCreatorButton: {
            height: '40px',
        },
        fullCreatorButtonLeftMargin: {
            height: '40px',
            marginLeft: theme.spacing(1)
        },
        fullCreatorButtonRightMargin: {
            height: '40px',
            marginRight: theme.spacing(1)
        },
        licenses: {
            width: '100%',
            margin: theme.spacing(1),
        },
    }),
);

interface StoreProps {
    thememode: PaletteType
}

type Props = DispatchProps & StoreProps;

const AboutPage: React.FC<Props> = (props: Props) => {

    const bigScreen = useMediaQuery('(min-width:610px)');
    const pcScreen = useMediaQuery('(min-width:1040px)');
    const bigPcScreen = useMediaQuery('(min-width:1300px)');

    const [redirectHome, setRedirectHome] = React.useState<boolean>(false);
    const [algorithmExpanded, setAlgorithmExpanded] = React.useState(false);
    const [techExpanded, setTechExpanded] = React.useState(false);
    const [disclaimerExpanded, setDisclaimerExpanded] = React.useState(false);

    const { thememode } = props;

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

    if (redirectHome) {
        return <Redirect push to={'/'} />
    }

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <AppBarView />
            {bigPcScreen && <div className={classes.topLeft}>
                <IconButton
                    onClick={() => {
                        window.history.back();
                        setTimeout(() => setRedirectHome(true), 10);
                    }}
                >
                    <ArrowBackOutlined fontSize='large' />
                </IconButton>
            </div>}
            <div className={classes.verticalSpace} />

            <div className={classes.root}>
                <Box className={classes.box}>
                    <div className={classes.root}>
                        <Typography variant={bigScreen ? "h2" : "h4"} className={classes.title}>
                            About
                        </Typography>
                    </div>
                    <div className={classes.verticalSpace} />
                    <Paper elevation={3} className={clsx(classes.paper, classes.minWidth650)}>
                        <Typography variant={bigScreen ? "h4" : "h5"} className={classes.title}>
                            Oskarito SpotiFest
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <div className={thememode === 'light' ? classes.circleIconLight : classes.circleIconDark}>
                                        <MusicNote fontSize={'large'} />
                                    </div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Discover new festivals suited specifically to your listening habits"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <div className={thememode === 'light' ? classes.circleIconLight : classes.circleIconDark}>
                                        <MusicNote fontSize={'large'} />
                                    </div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="See where your favorite artists are headed"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <div className={thememode === 'light' ? classes.circleIconLight : classes.circleIconDark}>
                                        <MusicNote fontSize={'large'} />
                                    </div>
                                </ListItemIcon>
                                <ListItemText
                                    primary="View entire lineups for future and past festivals"
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Box>
                <Box className={classes.box}>
                    <Paper elevation={3} className={clsx(classes.paper, classes.minWidth650)}>
                        <div className={classes.rowFlexCenter}>
                            <Typography variant={bigScreen ? "h4" : "h5"} onClick={() => setTechExpanded(!techExpanded)}>
                                Technical info
                            </Typography>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: techExpanded,
                                })}
                                onClick={() => setTechExpanded(!techExpanded)}
                                aria-expanded={techExpanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                        <Collapse in={techExpanded} timeout="auto" unmountOnExit>
                            <div className={classes.expandedDiv}>
                                <Grid container spacing={pcScreen ? 3 : 1} justify="center" alignItems="center">
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Frontend written in React with Typescript and Redux store.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <div className={classes.width40marginLeft}>
                                                <img src={process.env.PUBLIC_URL + '/techIcons/React-icon.svg'} className={classes.fullNoMargin} alt="React-icon" />
                                            </div>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/typescript.svg'} className={classes.full} alt="Typescript-icon" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/redux.svg'} className={classes.full} alt="Redux-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Frontend hosted on Netlify.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/full-netlify-logo-light.svg' : process.env.PUBLIC_URL + '/techIcons/full-netlify-logo-dark.svg'}
                                                className={classes.fullFirst} alt="Netlify-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Backend written in Python with Django and SqlLite as database.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/python-logo-generic.svg'} className={classes.fullFirst} alt="Python-logo" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/django-icon.svg'} className={classes.fullDjango} alt="Django-icon" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/SQLite.svg'} className={thememode === 'light' ? classes.full : clsx(classes.full, classes.lightBackground)} alt="Sqlite-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Django server set up with Gunicorn and Nginx.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/large_gunicorn.png' : process.env.PUBLIC_URL + '/techIcons/large_gunicorn_white.png'}
                                                className={classes.fullFirstMedium} alt="Gunicorn-logo" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/Nginx_logo.svg'} className={classes.fullNginx} alt="Nginx-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Backend hosted on a DigitalOcean Droplet running Ubuntu 20.04
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/digitalocean.svg'} className={classes.fullFirstMedium} alt="Digitalocean-icon" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/ubuntu-icon.svg'} className={classes.full} alt="Ubuntu-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Spotify for artist and playlist information.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/Spotify-Logo-Green.png'} className={classes.fullFirst} alt="Spotify-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                MusicFestivalWizard for lineup and festival information.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/MFW-logo-black.png' : process.env.PUBLIC_URL + '/techIcons/MFW-logo.png'}
                                                className={classes.fullFirst} alt="MusicFestivalWizard-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Code version control on GitHub.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/GitHub-Logo.png' : process.env.PUBLIC_URL + '/techIcons/GitHub-Logo-White.png'}
                                                className={classes.fullFirst} alt="GitHub-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Atlassian Jira board for task administration.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/jira-logo-blue.svg' : process.env.PUBLIC_URL + '/techIcons/jira-logo-white.svg'}
                                                className={classes.fullFirst} alt="Jira-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.flexEnd}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Domain bought on NameCheap.
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.rowFlex}>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/Namecheap-Logo.svg'} className={classes.fullLastRow} alt="Namecheap-logo" />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            <Box className={classes.licenses}>
                                <div className={classes.verticalSpace} />
                                <div className={classes.verticalSpace} />
                                <div>
                                    Icon licenses
                                </div>
                                <div>
                                    Facebook, <Link color={'primary'}
                                        href="https://commons.wikimedia.org/wiki/File:React-icon.svg"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        React-icon
                                    </Link> / <Link color={'primary'}
                                        href="https://creativecommons.org/licenses/by-sa/1.0/legalcode"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        CC BY-SA 1.0
                                    </Link>
                                </div>
                                <div>
                                    <Link color={'primary'}
                                        href="https://iconscout.com/icons/typescript"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        Typescript Icon
                                    </Link> on <Link color={'primary'}
                                        href="https://iconscout.com/contributors/icon-mafia"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        Icon Mafia
                                    </Link>
                                </div>
                                <div>
                                    <Link color={'primary'}
                                        href="https://iconscout.com/icons/redux"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        Redux Logo Icon
                                    </Link> by <Link color={'primary'}
                                        href="https://iconscout.com/contributors/icon-mafia"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        Icon Mafia
                                    </Link>
                                </div>
                                <div>
                                    <Link color={'primary'}
                                        href="https://www.python.org/community/logos/"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        Python-logo
                                    </Link> / <Link color={'primary'}
                                        href="https://www.python.org/psf/trademarks/"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        PSF Trademark Usage Policy
                                    </Link>
                                </div>
                                <div>
                                    <Link color={'primary'}
                                        href="https://icon-icons.com/icon/file-type-django/130645"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        Django Icon
                                    </Link> / <Link color={'primary'}
                                        href="https://creativecommons.org/licenses/by/4.0/"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        CC BY 4.0
                                    </Link>
                                </div>
                            </Box>
                        </Collapse>
                    </Paper>
                </Box>
                <Box className={classes.box}>
                    <Paper elevation={3} className={clsx(classes.paper, classes.minWidth650)}>
                        <div className={classes.rowFlexCenter}>
                            <Typography variant={bigScreen ? "h4" : "h5"} onClick={() => setAlgorithmExpanded(!algorithmExpanded)}>
                                Matching algorithm
                            </Typography>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: algorithmExpanded,
                                })}
                                onClick={() => setAlgorithmExpanded(!algorithmExpanded)}
                                aria-expanded={algorithmExpanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                        <Collapse in={algorithmExpanded} timeout="auto" unmountOnExit>
                            <div className={classes.expandedDiv}>
                                <Typography variant="body1" className={classes.textAlign}>
                                    The "Match with" selector on top of the main page allows you to select a playlist or your most played artists as a match basis for festivals. The match score given to each festival is a combination of genre matching and artist matching to the selected match basis. The genre matching finds the genres of the match basis and checks how well these coincide with the genres of the festival. The artist score counts how many artists in the match basis are attending the festival. The more artists in the match basis, the more attending artists are needed for a high score. To see the individual genre and artist score for each festival you can hold the mouse pointer over the score circle on a pc or press and hold the score circle on a touch screen.
                                </Typography>
                            </div>
                        </Collapse>
                    </Paper>
                </Box>
                <Box className={classes.box}>
                    <Paper elevation={3} className={clsx(classes.paper, classes.minWidth650)}>
                        <div className={classes.rowFlexCenter}>
                            <Typography variant={bigScreen ? "h4" : "h5"} onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}>
                                Disclaimer
                            </Typography>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: disclaimerExpanded,
                                })}
                                onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
                                aria-expanded={disclaimerExpanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                        <Collapse in={disclaimerExpanded} timeout="auto" unmountOnExit>
                            <div className={classes.expandedDiv}>
                                <Typography variant="body1" className={classes.textAlign}>
                                    The creator of Oskarito SpotiFest takes no responsibility for any inaccuracies in the information on the site, as this is purely a hobby project at this point. No personal data is collected by using this site. When logging out or going to /login, all browser data linked to the site is deleted.
                                </Typography>
                            </div>
                        </Collapse>
                    </Paper>
                </Box>
                <div className={classes.verticalSpace} />
                <div className={classes.verticalSpace} />
                <div className={classes.verticalSpace} />
                <Box className={classes.box2}>
                    <Paper elevation={3} className={clsx(classes.paper, classes.maxWidth400)}>
                        <div className={classes.flexColumn}>
                            <Typography variant={bigScreen ? "h4" : "h5"} className={classes.title}>
                                Created by
                            </Typography>
                            <img src={process.env.PUBLIC_URL + '/creator_image_cropped.jpg'} className={classes.creatorImage} alt="React-icon" />
                            <Typography variant="h6" className={classes.textAlign}>
                                Oskar Asplin
                            </Typography>
                            <div className={classes.verticalSpace} />
                            <Button onClick={() => window.open("https://www.linkedin.com/in/oskar-buset-asplin-22796314a", '_blank')}>
                                <img src={process.env.PUBLIC_URL + '/techIcons/LinkedIn-Logo.png'} className={classes.fullCreatorButtonLeftMargin} alt="LinkedIn" />
                            </Button>
                            <Button onClick={() => window.open("https://github.com/OskarAsplin", '_blank')}>
                                <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/GitHub-Logo.png' : process.env.PUBLIC_URL + '/techIcons/GitHub-Logo-White.png'}
                                    className={classes.fullCreatorButton} alt="GitHub-logo" />
                                <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/GitHub-Mark.png' : process.env.PUBLIC_URL + '/techIcons/GitHub-Mark-Light.png'}
                                    className={classes.fullCreatorButtonRightMargin} alt="" />
                            </Button>
                            <div className={classes.verticalSpace} />
                        </div>
                    </Paper>
                </Box>
            </div>
        </MuiThemeProvider>
    );
}

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
)(AboutPage);
