import React from 'react';
import { AppState, DispatchProps } from "../redux/types";
import { connect } from "react-redux";
import { createStyles, CssBaseline, MuiThemeProvider, Theme, Box, Paper, Typography, Link, IconButton, Collapse, List, ListItem, ListItemIcon, ListItemText, PaletteType } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import AppBarView from "./parts/AppBarView";
import TechStackContent from "./parts/TechStackContent";
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
            margin: theme.spacing(3, 2, 2, 2),
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
            marginBottom: theme.spacing(4),
            '&:last-child': {
                marginBottom: 0,
            }
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

interface TechInfoRow {
    text: string;
    icons: { path: string, class: string }[];
}

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

    const lightMode: boolean = thememode === 'light';

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
                        {["Festival matching with more than 500 festivals worldwide",
                        "Festival pages with current and previous lineups",
                        "Artist pages to see which festivals each artist is attending"].map((text, i) => {
                            return (<ListItem key={'feature:' + i}>
                                <ListItemIcon>
                                    <MusicNote fontSize={'large'} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                />
                            </ListItem>);
                        })}
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
                            <TechStackContent pcScreen={pcScreen} lightMode={lightMode}/>
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
                                    <div className={classes.usagePart}>
                                        <img src={process.env.PUBLIC_URL + '/usageImages/festival-match-marked.jpg'} className={classes.usageImg} alt="festival-match-marked" />
                                        <Typography variant="body1" className={clsx(classes.textAlign, classes.usageText)}>
                                            Click on a festival title or image to see full lineups and more. Click on an artist icon to see the artist's future and past festivals and more. Click on 'popular artists at this festival' to see the most popular artists in the festival lineup.
                                        </Typography>
                                    </div>
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
                <Box className={classes.box2}>
                    <Paper elevation={3} className={clsx(classes.creatorPaper, classes.maxWidth400)}>
                        <div className={classes.flexColumn}>
                            <Typography variant={"h5"} className={classes.textAlign}>
                                Created by
                            </Typography>
                            <Box className={lightMode ? clsx(classes.creatorImgBox, classes.roundedCorners) : clsx(classes.creatorImgBox, classes.darkerBackground)}>
                                <img src={process.env.PUBLIC_URL + '/creator_image_cropped.jpg'} className={classes.creatorImage} alt="Creator" />
                            </Box>
                            <Typography variant="h6" className={classes.textAlign}>
                                Oskar Asplin
                            </Typography>
                            <div className={classes.rowFlexCenter}>
                                <IconButton onClick={() => window.open("https://www.linkedin.com/in/oskar-buset-asplin-22796314a", '_blank')}>
                                    <div className={clsx(classes.socialButtonBackground, classes.linkedInSocialButton)}>
                                        <img src={process.env.PUBLIC_URL + '/techIcons/LinkedIn-Bug.png'} className={classes.linkeidInSocialBug} alt="LinkedIn" />
                                    </div>
                                </IconButton>
                                <IconButton onClick={() => window.open("https://github.com/OskarAsplin", '_blank')}>
                                    <div className={classes.socialButtonBackground}>
                                        <img src={lightMode ? process.env.PUBLIC_URL + '/techIcons/GitHub-Mark.png' : process.env.PUBLIC_URL + '/techIcons/GitHub-Mark-white.png'}
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
