import React from 'react';
import { createStyles, Theme, Box, Typography, Link, Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        expandedDiv: {
            paddingBottom: theme.spacing(1),
            paddingTop: theme.spacing(1),
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        licenses: {
            width: '100%',
            margin: theme.spacing(1),
            paddingTop: theme.spacing(2),
        },
        textAlign: {
            '@media (max-width: 609px)': {
                textAlign: 'center'
            },
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
            marginRight: '-15px',
            marginLeft: '-15px',
        },
        djangoIconSize: {
            height: '50px',
            marginTop: '-5px',
            marginBottom: '-5px',
            marginRight: '-8px',
        },
        pythonRemoveRightSpace: {
            marginRight: '-18px', // -10 for python and -8 for Django
            marginBottom: '-4px',
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
    }),
);

interface OwnProps {
    pcScreen: boolean;
    lightMode: boolean;
}

type Props = OwnProps;

interface TechInfoRow {
    text: string;
    icons: { path: string, class: string }[];
}

const TechStackContent: React.FC<Props> = (props: Props) => {

    const { lightMode, pcScreen } = props;

    const classes = useStyles();

    const techInfoRows: TechInfoRow[] = [
        {
            text: 'Frontend written in React with Typescript and Redux store',
            icons: [
                { path: 'React.svg', class: classes.reactIconSize },
                { path: 'Typescript.svg', class: clsx(classes.iconDefaultHeight, classes.iconMarginLeft) },
                { path: 'Redux.svg', class: clsx(classes.iconDefaultHeight, classes.iconMarginLeft) }
            ]
        },
        {
            text: 'UI based on Material-UI',
            icons: [{ path: 'MUI.svg', class: classes.iconDefaultHeight }]
        },
        {
            text: 'Frontend hosted on Netlify',
            icons: [{ path: lightMode ? 'Netlify.svg' : 'Netlify-white.svg', class: classes.iconDefaultHeight }]
        },
        {
            text: 'Backend written in Python with Django and SQLite as database',
            icons: [
                { path: lightMode ? 'Python.svg' : 'Python-white.svg', class: clsx(classes.iconDefaultHeight, classes.pythonRemoveRightSpace) },
                { path: 'Django.svg', class: clsx(classes.djangoIconSize, classes.iconMarginLeft) },
                { path: lightMode ? 'SQLite.svg' : 'SQLite-white.png', class: lightMode ? clsx(classes.iconDefaultHeight, classes.iconMarginLeft) : clsx(classes.iconDefaultHeight, classes.iconMarginLeft) }
            ]
        },
        {
            text: 'Django server set up with Gunicorn and Nginx',
            icons: [
                { path: lightMode ? 'Gunicorn.png' : 'Gunicorn-white.png', class: classes.mediumSize },
                { path: 'Nginx.svg', class: clsx(classes.smallSize, classes.iconMarginLeft) }
            ]
        },
        {
            text: 'Backend server environment contained with Docker',
            icons: [{ path: lightMode ? 'Docker.png' : 'Docker-white.png', class: classes.iconDefaultHeight }]
        },
        {
            text: 'Backend hosted on DigitalOcean running Ubuntu 20.04',
            icons: [
                { path: 'Digitalocean.svg', class: classes.mediumSize },
                { path: 'Ubuntu.svg', class: clsx(classes.iconDefaultHeight, classes.iconMarginLeft) }
            ]
        },
        {
            text: 'Playlists and artists from Spotify using OAuth 2.0 authorization',
            icons: [
                { path: 'Spotify.png', class: classes.iconDefaultHeight },
                { path: 'OAuth2.png', class: clsx(classes.iconDefaultHeight, classes.iconMarginLeft) }
            ]
        },
        {
            text: 'Lineup and festival information from Music Festival Wizard',
            icons: [{ path: lightMode ? 'MFW.png' : 'MFW-white.png', class: classes.iconDefaultHeight }]
        },
        {
            text: 'Code version control on GitHub',
            icons: [{ path: lightMode ? 'GitHub.png' : 'GitHub-white.png', class: classes.smallSize }]
        },
        {
            text: 'Domain bought on NameCheap',
            icons: [{ path: lightMode ? 'Namecheap.svg' : 'Namecheap-white.png', class: classes.mediumSize }]
        },
    ];

    const insertTechInfoRow = (techInfo: TechInfoRow) => {
        return (
            <React.Fragment key={'techRow:' + techInfo.text}>
                <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                    <div className={classes.techInfoText}>
                        <Typography variant="body1" className={classes.textAlign}>
                            {techInfo.text}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                    <div className={classes.iconsContainer}>
                        {techInfo.icons.map((icon) => {
                            return (<img src={process.env.PUBLIC_URL + '/techIcons/' + icon.path} key={icon.path}
                                className={icon.class} alt={icon.path} />);
                        })}
                    </div>
                </Grid>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className={classes.expandedDiv}>
                <Grid container spacing={pcScreen ? 3 : 1} justify="center" alignItems="center">
                    {techInfoRows.map((techInfoRow) => insertTechInfoRow(techInfoRow))}
                </Grid>
            </div>
            <Box className={classes.licenses}>
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
                    </Link> by <Link color={'primary'}
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
        </React.Fragment>
    );
}

export default TechStackContent;
