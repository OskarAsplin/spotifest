import { Box, Typography, Link, Grid } from "@material-ui/core";
import React from 'react';
import '../pages/AboutPage.scss';
import './TechStackContent.scss';

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

    const techInfoRows: TechInfoRow[] = [
        {
            text: 'Frontend written in React with Typescript and Redux store',
            icons: [
                { path: 'React.svg', class: 'reactIconSize' },
                { path: 'Typescript.svg', class: 'iconDefaultHeight iconMarginLeft' },
                { path: 'Redux.svg', class: 'iconDefaultHeight iconMarginLeft' }
            ]
        },
        {
            text: 'UI based on Material-UI',
            icons: [{ path: 'MUI.svg', class: 'iconDefaultHeight' }]
        },
        {
            text: 'Frontend hosted on Netlify',
            icons: [{ path: lightMode ? 'Netlify.svg' : 'Netlify-white.svg', class: 'iconDefaultHeight' }]
        },
        {
            text: 'Backend written in Python with Django and SQLite as database',
            icons: [
                { path: lightMode ? 'Python.svg' : 'Python-white.svg', class: 'iconDefaultHeight pythonRemoveRightSpace' },
                { path: 'Django.svg', class: 'djangoIconSize iconMarginLeft' },
                { path: lightMode ? 'SQLite.svg' : 'SQLite-white.png', class: 'iconDefaultHeight iconMarginLeft' }
            ]
        },
        {
            text: 'Django server set up with Gunicorn and Nginx',
            icons: [
                { path: lightMode ? 'Gunicorn.png' : 'Gunicorn-white.png', class: 'mediumSize' },
                { path: 'Nginx.svg', class: 'smallSize iconMarginLeft' }
            ]
        },
        {
            text: 'Backend server environment contained with Docker',
            icons: [{ path: lightMode ? 'Docker.png' : 'Docker-white.png', class: 'iconDefaultHeight' }]
        },
        {
            text: 'Backend hosted on DigitalOcean running Ubuntu 20.04',
            icons: [
                { path: 'Digitalocean.svg', class: 'mediumSize' },
                { path: 'Ubuntu.svg', class: 'iconDefaultHeight iconMarginLeft' }
            ]
        },
        {
            text: 'Playlists and artists from Spotify using OAuth 2.0 authorization',
            icons: [
                { path: 'Spotify.png', class: 'iconDefaultHeight' },
                { path: 'OAuth2.png', class: 'iconDefaultHeight iconMarginLeft' }
            ]
        },
        {
            text: 'Lineup and festival information from Music Festival Wizard',
            icons: [{ path: lightMode ? 'MFW.png' : 'MFW-white.png', class: 'iconDefaultHeight' }]
        },
        {
            text: 'Code version control on GitHub',
            icons: [{ path: lightMode ? 'GitHub.png' : 'GitHub-white.png', class: 'smallSize' }]
        },
        {
            text: 'Domain bought on NameCheap',
            icons: [{ path: lightMode ? 'Namecheap.svg' : 'Namecheap-white.png', class: 'mediumSize' }]
        },
    ];

    const insertTechInfoRow = (techInfo: TechInfoRow) => {
        return (
            <React.Fragment key={'techRow:' + techInfo.text}>
                <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                    <div className={'techInfoText'}>
                        <Typography variant="body1" className='textAlign'>
                            {techInfo.text}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
                    <div className={'iconsContainer'}>
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
            <div className='expandedDiv'>
                <Grid container spacing={pcScreen ? 3 : 1} justify="center" alignItems="center">
                    {techInfoRows.map((techInfoRow) => insertTechInfoRow(techInfoRow))}
                </Grid>
            </div>
            <Box className={'licenses'}>
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
