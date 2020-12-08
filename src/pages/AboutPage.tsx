import React from 'react';
import { AppState, DispatchProps } from "../redux/types";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Box, Paper, Typography, Link, IconButton, Collapse, List, ListItem, ListItemIcon, ListItemText, Grid, PaletteType } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import { lightBlue, pink } from "@material-ui/core/colors";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import ArrowBackOutlined from '@material-ui/icons/ArrowBack';
import MusicNote from '@material-ui/icons/MusicNote';
import { Redirect } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBarSpace: {
            paddingBottom: theme.spacing(6),
        },
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
        paperTop: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 610px)': {
                padding: theme.spacing(0.5, 2, 0.5, 2),
            },
            '@media (max-width: 609px)': {
                '@media (min-width: 440px)': {
                    padding: theme.spacing(0.5, 1, 0.5, 1),
                },
            },
            '@media (max-width: 439px)': {
                padding: theme.spacing(0.5, 0, 0.5, 0),
            },
            justifyContent: 'center',
            alignItems: 'center',
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 610px)': {
                padding: theme.spacing(0.5, 3, 0.5, 3),
            },
            '@media (max-width: 609px)': {
                padding: theme.spacing(0.5, 2, 0.5, 2),
            },
            justifyContent: 'center',
            alignItems: 'center',
        },
        creatorPaper: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(1, 0, 1, 0),
            justifyContent: 'center',
            alignItems: 'center',
        },
        maxWidth400: {
            width: '100%',
            maxWidth: '400px'
        },
        minWidth400: {
            '@media (min-width: 550px)': {
                minWidth: '400px'
            },
            '@media (max-width: 549px)': {
                width: '100%'
            },
        },
        box: {
            '@media (max-width: 549px)': {
                width: '100%'
            },
            maxWidth: '650px',
            margin: theme.spacing(0, 2, 2, 2),
        },
        box2: {
            width: '100%',
            maxWidth: '650px',
            margin: theme.spacing(0, 2, 2, 2),
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
        },
        techBox: {
            '@media (max-width: 549px)': {
                width: '100%'
            },
            '@media (max-width: 1039px)': {
                maxWidth: '650px',
            },
            '@media (min-width: 1040px)': {
                maxWidth: '1000px',
            },
            margin: theme.spacing(0, 2, 2, 2),
        },
        supportExpandedBox: {
            width: '100%',
            maxWidth: '650px',
            margin: theme.spacing(0, 2, 2, 2),
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
        expandedDiv: {
            paddingBottom: theme.spacing(1),
            paddingTop: theme.spacing(1),
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        textAlign: {
            '@media (max-width: 609px)': {
                textAlign: 'center'
            },
        },
        title: {
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
        rowFlexCenter: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconsContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '@media (max-width: 1039px)': {
                justifyContent: 'center',
                marginBottom: theme.spacing(5),
            },
            '@media (min-width: 1040px)': {
                marginLeft: theme.spacing(5),
            },
        },
        noMarginBottom: {
            marginBottom: theme.spacing(0) + '!important',
        },
        iconDefaultHeight: {
            height: '40px',
        },
        iconMarginLeft: {
            '@media (min-width: 500px)': {
                marginLeft: theme.spacing(5),
            },
            '@media (max-width: 499px)': {
                marginLeft: theme.spacing(3),
            },
        },
        mediumSize: {
            '@media (min-width: 500px)': {
                height: '40px',
            },
            '@media (max-width: 499px)': {
                height: '35px',
            },
        },
        smallSize: {
            '@media (min-width: 500px)': {
                height: '32px',
                marginTop: '4px',
                marginBottom: '4px'
            },
            '@media (max-width: 499px)': {
                height: '24px',
            },
        },
        reactIconSize: {
            height: '54px',
            marginTop: '-7px',
            marginBottom: '-7px',
        },
        djangoIconSize: {
            height: '50px',
            marginTop: '-5px',
            marginBottom: '-5px',
        },
        pythonRemoveRightSpace: {
            marginRight: '-10px',
        },
        restrainIconDimensions: {
            width: '40px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        techInfoText: {
            display: 'flex',
            '@media (min-width: 1040px)': {
                flexDirection: 'row-reverse',
            },
            '@media (max-width: 1039px)': {
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
        creatorImgBox: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: theme.spacing(1, 0, 1, 0),
        },
        darkerBackground: {
            backgroundColor: '#383838'
        },
        creatorImage: {
            width: '75%',
            maxWidth: '300px'
        },
        roundedCorners: {
            borderRadius: '5%',
        },
        licenses: {
            width: '100%',
            margin: theme.spacing(1),
        },
        noPadding: {
            padding: 0,
        },
        starIcon: {
            marginLeft: '4px',
            marginRight: '4px'
        },
        adjustTextForStar: {
            display: 'flex',
            alignItems: 'center'
        },
        socialButtonBackground: {
            height: '46px',
            width: '46px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        linkedInSocialButton: {
            backgroundColor: '#2867b2',  //'#0069bb'
        },
        githubSocialBug: {
            width: '46px',
            height: '46px'
        },
        linkeidInSocialBug: {
            margin: theme.spacing(0.75, 0.75, 1, 1),
            width: '24px',
            height: '24px'
        },
        usageImg: {
            width: '100%',
            marginBottom: theme.spacing(1),
            '@media (min-width: 720px)': {
                marginLeft: theme.spacing(4),
                maxWidth: '50%',
            },
            '@media (max-width: 719px)': {
                maxWidth: '315px',
            },
        },
        topBarImg: {
            maxHeight: '44px'
        },
        usagePart: {
            display: 'flex',
            '@media (min-width: 720px)': {
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
            },
            '@media (max-width: 719px)': {
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            },
        },
        usageBox: {
            display: 'flex',
            flexDirection: 'column'
        },
        usageText: {
            '@media (min-width: 720px)': {
                maxWidth: '50%'
            },
        },
    }),
);

interface StoreProps {
    thememode: PaletteType
}

type Props = DispatchProps & StoreProps;

const AboutPage: React.FC<Props> = (props: Props) => {

    const bigScreen = useMediaQuery('(min-width:610px)');
    const biggerScreen = useMediaQuery('(min-width:720px)');
    const pcScreen = useMediaQuery('(min-width:1040px)');
    const bigPcScreen = useMediaQuery('(min-width:1300px)');

    const [redirectHome, setRedirectHome] = React.useState<boolean>(false);
    const [usageExpanded, setUsageExpanded] = React.useState(false);
    const [techExpanded, setTechExpanded] = React.useState(false);
    const [supportExpanded, setSupportExpanded] = React.useState(false);
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
                main: pink[400],
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
            <div className={classes.appBarSpace} />
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
            <div className={classes.verticalSpace} />

            <div className={classes.root}>
                <Box className={classes.box}>
                    <Typography variant={bigScreen ? "h4" : "h5"} className={clsx(classes.title, classes.textAlign)}>
                        Oskarito SpotiFest features
                    </Typography>
                    <div className={classes.verticalSpace} />
                    <List className={classes.noPadding}>
                        <ListItem>
                            <ListItemIcon>
                                <MusicNote fontSize={'large'} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Festival matching with more than 500 festivals worldwide"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <MusicNote fontSize={'large'} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Festival pages with current and previous lineups"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <MusicNote fontSize={'large'} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Artist pages to see which festivals each artist is attending"
                            />
                        </ListItem>
                    </List>
                </Box>
                <Box className={classes.techBox}>
                    <Paper elevation={3} className={clsx(classes.paper, classes.minWidth400)}>
                        <div className={classes.rowFlexCenter}>
                            <Typography variant={"h5"} onClick={() => setTechExpanded(!techExpanded)}>
                                Technology stack
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
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Frontend written in React with Typescript and Redux store
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <div className={classes.restrainIconDimensions}>
                                                <img src={process.env.PUBLIC_URL + '/techIcons/React-icon.svg'} className={classes.reactIconSize} alt="React-icon" />
                                            </div>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/typescript.svg'} className={clsx(classes.iconDefaultHeight, classes.iconMarginLeft)} alt="Typescript-icon" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/redux.svg'} className={clsx(classes.iconDefaultHeight, classes.iconMarginLeft)} alt="Redux-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                UI based on Material-UI
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/mui-logo.svg'}
                                                className={classes.iconDefaultHeight} alt="MUI-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Frontend hosted on Netlify
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/full-netlify-logo-light.svg' : process.env.PUBLIC_URL + '/techIcons/full-netlify-logo-dark.svg'}
                                                className={classes.iconDefaultHeight} alt="Netlify-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Backend written in Python with Django and SQLite as database
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/python-logo-generic.svg' : process.env.PUBLIC_URL + '/techIcons/python-logo-generic-white.svg'}
                                                className={clsx(classes.iconDefaultHeight, classes.pythonRemoveRightSpace)} alt="Python-logo" />
                                            <div className={clsx(classes.restrainIconDimensions, classes.iconMarginLeft)}>
                                                <img src={process.env.PUBLIC_URL + '/techIcons/django-icon.svg'} className={classes.djangoIconSize} alt="Django-icon" />
                                            </div>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/SQLite.svg' : process.env.PUBLIC_URL + '/techIcons/SQLite-white.png'}
                                                className={thememode === 'light' ? clsx(classes.iconDefaultHeight, classes.iconMarginLeft) : clsx(classes.iconDefaultHeight, classes.iconMarginLeft)} alt="Sqlite-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Django server set up with Gunicorn and Nginx
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/large_gunicorn.png' : process.env.PUBLIC_URL + '/techIcons/large_gunicorn_white.png'}
                                                className={classes.mediumSize} alt="Gunicorn-logo" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/Nginx_logo.svg'} className={clsx(classes.smallSize, classes.iconMarginLeft)} alt="Nginx-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Backend hosted on DigitalOcean running Ubuntu 20.04
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/digitalocean.svg'} className={classes.mediumSize} alt="Digitalocean-icon" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/ubuntu-icon.svg'} className={clsx(classes.iconDefaultHeight, classes.iconMarginLeft)} alt="Ubuntu-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Playlists and artists from Spotify using OAuth 2.0 authorization
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={process.env.PUBLIC_URL + '/techIcons/Spotify-Logo-Green.png'} className={classes.iconDefaultHeight} alt="Spotify-logo" />
                                            <img src={process.env.PUBLIC_URL + '/techIcons/oauth-2.png'} className={clsx(classes.iconDefaultHeight, classes.iconMarginLeft)} alt="Oauth-2-icon" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Lineup and festival information from Music Festival Wizard
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/MFW-logo-black.png' : process.env.PUBLIC_URL + '/techIcons/MFW-logo.png'}
                                                className={classes.iconDefaultHeight} alt="MusicFestivalWizard-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Code version control on GitHub
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.iconsContainer}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/GitHub-Logo.png' : process.env.PUBLIC_URL + '/techIcons/GitHub-Logo-White.png'}
                                                className={classes.smallSize} alt="GitHub-logo" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={classes.techInfoText}>
                                            <Typography variant="body1" className={classes.textAlign}>
                                                Domain bought on NameCheap
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                                        <div className={clsx(classes.iconsContainer, classes.noMarginBottom)}>
                                            <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/Namecheap-Logo.svg' : process.env.PUBLIC_URL + '/techIcons/Namecheap-Logo-white.png'}
                                                className={classes.mediumSize} alt="Namecheap-logo" />
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
                <Box className={biggerScreen && supportExpanded ? classes.supportExpandedBox: classes.box}>
                    <Paper elevation={3} className={clsx(classes.paperTop, classes.minWidth400)}>
                        <div className={classes.rowFlexCenter}>
                            <Typography variant={"h5"} onClick={() => setSupportExpanded(!supportExpanded)}>
                                Ways to support
                            </Typography>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: supportExpanded,
                                })}
                                onClick={() => setSupportExpanded(!supportExpanded)}
                                aria-expanded={supportExpanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                        <Collapse in={supportExpanded} timeout="auto" unmountOnExit>
                            <div className={classes.expandedDiv}>
                                <List className={classes.noPadding}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MusicNote fontSize={'large'} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Spread the word! Tell everyone about Oskarito SpotiFest"
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MusicNote fontSize={'large'} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Buy your festival tickets through the ticket links on the site"
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <MusicNote fontSize={'large'} />
                                        </ListItemIcon>
                                        <ListItemText disableTypography className={classes.adjustTextForStar}>
                                            <Typography variant="body1">Give the code a </Typography><StarIcon className={classes.starIcon} />
                                            <Typography variant="body1"> on <Link color={'primary'}
                                                href="https://github.com/OskarAsplin/spotifest"
                                                target={"_blank"}
                                                rel="noopener noreferrer">
                                                GitHub
                                                </Link></Typography>
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </div>
                        </Collapse>
                    </Paper>
                </Box>
                <Box className={classes.box}>
                    <Paper elevation={3} className={clsx(classes.paper, classes.minWidth400)}>
                        <div className={classes.rowFlexCenter}>
                            <Typography variant={"h5"} onClick={() => setUsageExpanded(!usageExpanded)}>
                                How to use
                            </Typography>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: usageExpanded,
                                })}
                                onClick={() => setUsageExpanded(!usageExpanded)}
                                aria-expanded={usageExpanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                        <Collapse in={usageExpanded} timeout="auto" unmountOnExit>
                            <div className={classes.expandedDiv}>
                                <div className={classes.usageBox}>
                                    <div className={classes.usagePart}>
                                        <img src={process.env.PUBLIC_URL + '/usageImages/match-settings.jpg'} className={classes.usageImg} alt="match-settings-box" />
                                        <Typography variant="body1" className={clsx(classes.textAlign, classes.usageText)}>
                                            Adjust the match settings on the main page to get your festival matches.
                                        </Typography>
                                    </div>
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.usagePart}>
                                        <img src={process.env.PUBLIC_URL + '/usageImages/festival-match-marked.jpg'} className={classes.usageImg} alt="festival-match-marked" />
                                        <Typography variant="body1" className={clsx(classes.textAlign, classes.usageText)}>
                                            Click on a festival title or image to see full lineups and more. Click on an artist icon to see the artist's future and past festivals and more. Click on 'popular artists at this festival' to see the most popular artists in the festival lineup.
                                        </Typography>
                                    </div>
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.verticalSpace} />
                                    <div className={classes.usagePart}>
                                        <img src={process.env.PUBLIC_URL + '/usageImages/top-bar.jpg'} className={clsx(classes.usageImg, classes.topBarImg)} alt="top-bar" />
                                        <Typography variant="body1" className={clsx(classes.textAlign, classes.usageText)}>
                                            Clicking 'Oskarito SpotiFest' takes you back to the festival matching. Click the search icon to search for festivals and artists. Click the account avatar to log out. Click the hamburger menu to get to the about page or to switch between dark/light mode.
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </Collapse>
                    </Paper>
                </Box>
                <Box className={classes.box}>
                    <Paper elevation={3} className={clsx(classes.paper, classes.minWidth400)}>
                        <div className={classes.rowFlexCenter}>
                            <Typography variant={"h5"} onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}>
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
                                    The creator of Oskarito SpotiFest takes no responsibility for any inaccuracies in the information on the site, as this is purely a hobby project at this point. No personal data is collected by this site, but youtube videos showed on the festival pages collect cookies. When logging out or going to <Link color={'primary'}
                                        href="https://www.spotifest.app/login"
                                        target={"_blank"}
                                        rel="noopener noreferrer">
                                        spotifest.app/login
                                        </Link>, all browser data linked to the site is deleted.
                                </Typography>
                            </div>
                        </Collapse>
                    </Paper>
                </Box>
                <div className={classes.verticalSpace} />
                <div className={classes.verticalSpace} />
                <div className={classes.verticalSpace} />
                <Box className={classes.box2}>
                    <Paper elevation={3} className={clsx(classes.creatorPaper, classes.maxWidth400)}>
                        <div className={classes.flexColumn}>
                            <Typography variant={"h5"} className={classes.textAlign}>
                                Created by
                            </Typography>
                            <Box className={thememode === 'light' ? clsx(classes.creatorImgBox, classes.roundedCorners) : clsx(classes.creatorImgBox, classes.darkerBackground)}>
                                <img src={process.env.PUBLIC_URL + '/creator_image_cropped.jpg'} className={classes.creatorImage} alt="Creator" />
                            </Box>
                            <Typography variant="h6" className={classes.textAlign}>
                                Oskar Asplin
                            </Typography>
                            <div className={classes.rowFlexCenter}>
                                <IconButton onClick={() => window.open("https://www.linkedin.com/in/oskar-buset-asplin-22796314a", '_blank')}>
                                    <div className={clsx(classes.socialButtonBackground, classes.linkedInSocialButton)}>
                                        <img src={process.env.PUBLIC_URL + '/techIcons/LI-In-Bug-white.png'} className={classes.linkeidInSocialBug} alt="LinkedIn" />
                                    </div>
                                </IconButton>
                                <IconButton onClick={() => window.open("https://github.com/OskarAsplin", '_blank')}>
                                    <div className={classes.socialButtonBackground}>
                                        <img src={thememode === 'light' ? process.env.PUBLIC_URL + '/techIcons/GitHub-Mark.png' : process.env.PUBLIC_URL + '/techIcons/GitHub-Mark-Light.png'}
                                            className={classes.githubSocialBug} alt="GitHub" />
                                    </div>
                                </IconButton>
                            </div>
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
