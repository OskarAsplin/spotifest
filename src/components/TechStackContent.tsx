import { Fragment } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import clsx from 'clsx';
import aboutPageStyles from '../pages/AboutPage.module.scss';
import styles from './TechStackContent.module.scss';
import StandardLink from './StandardLink';

interface OwnProps {
  pcScreen: boolean;
  lightMode: boolean;
}

type Props = OwnProps;

interface TechInfoRow {
  text: string;
  icons: { path: string; class: string }[];
}

const TechStackContent = (props: Props) => {
  const { lightMode, pcScreen } = props;

  const techInfoRows: TechInfoRow[] = [
    {
      text: 'Frontend written in React with Typescript and Redux store',
      icons: [
        { path: 'React.svg', class: styles.reactIconSize },
        {
          path: 'Typescript.svg',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
        {
          path: 'Redux.svg',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: 'UI based on Material-UI',
      icons: [{ path: 'MUI.svg', class: styles.iconDefaultHeight }],
    },
    {
      text: 'Frontend hosted on Netlify',
      icons: [
        {
          path: lightMode ? 'Netlify.svg' : 'Netlify-white.svg',
          class: styles.iconDefaultHeight,
        },
      ],
    },
    {
      text: 'Backend written in Python with Django and SQLite as database',
      icons: [
        {
          path: lightMode ? 'Python.svg' : 'Python-white.svg',
          class: clsx(styles.iconDefaultHeight, styles.pythonRemoveRightSpace),
        },
        {
          path: 'Django.svg',
          class: clsx(styles.djangoIconSize, styles.iconMarginLeft),
        },
        {
          path: lightMode ? 'SQLite.svg' : 'SQLite-white.png',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: 'Django server set up with Gunicorn and Nginx',
      icons: [
        {
          path: lightMode ? 'Gunicorn.png' : 'Gunicorn-white.png',
          class: styles.mediumSize,
        },
        {
          path: 'Nginx.svg',
          class: clsx(styles.smallSize, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: 'Backend server environment contained with Docker',
      icons: [
        {
          path: lightMode ? 'Docker.png' : 'Docker-white.png',
          class: styles.iconDefaultHeight,
        },
      ],
    },
    {
      text: 'Backend hosted on DigitalOcean running Ubuntu 20.04',
      icons: [
        { path: 'Digitalocean.svg', class: styles.mediumSize },
        {
          path: 'Ubuntu.svg',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: 'Playlists and artists from Spotify using OAuth 2.0 authorization',
      icons: [
        { path: 'Spotify.png', class: styles.iconDefaultHeight },
        {
          path: 'OAuth2.png',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: 'Lineup and festival information from Music Festival Wizard',
      icons: [
        {
          path: lightMode ? 'MFW.png' : 'MFW-white.png',
          class: styles.iconDefaultHeight,
        },
      ],
    },
    {
      text: 'Code version control on GitHub',
      icons: [
        {
          path: lightMode ? 'GitHub.png' : 'GitHub-white.png',
          class: styles.smallSize,
        },
      ],
    },
    {
      text: 'Domain bought on NameCheap',
      icons: [
        {
          path: lightMode ? 'Namecheap.svg' : 'Namecheap-white.png',
          class: styles.mediumSize,
        },
      ],
    },
  ];

  const insertTechInfoRow = (techInfo: TechInfoRow) => {
    return (
      <Fragment key={'techRow:' + techInfo.text}>
        <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
          <div className={styles.techInfoText}>
            <Typography variant="body1" className={styles.textAlign}>
              {techInfo.text}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={pcScreen ? 6 : 12} zeroMinWidth>
          <div className={styles.iconsContainer}>
            {techInfo.icons.map((icon) => {
              return (
                <img
                  src={process.env.PUBLIC_URL + '/techIcons/' + icon.path}
                  key={icon.path}
                  className={icon.class}
                  alt={icon.path}
                />
              );
            })}
          </div>
        </Grid>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className={aboutPageStyles.expandedDiv}>
        <Grid
          container
          spacing={pcScreen ? 3 : 1}
          justifyContent="center"
          alignItems="center"
        >
          {techInfoRows.map((techInfoRow) => insertTechInfoRow(techInfoRow))}
        </Grid>
      </div>
      <Box className={styles.licenses}>
        <div>Icon licenses</div>
        <div>
          {' Facebook, '}
          <StandardLink href="https://commons.wikimedia.org/wiki/File:React-icon.svg">
            React-icon
          </StandardLink>
          {' / '}
          <StandardLink href="https://creativecommons.org/licenses/by-sa/1.0/legalcode">
            CC BY-SA 1.0
          </StandardLink>
        </div>
        <div>
          <StandardLink href="https://iconscout.com/icons/typescript">
            Typescript Icon
          </StandardLink>
          {' by '}
          <StandardLink href="https://iconscout.com/contributors/icon-mafia">
            Icon Mafia
          </StandardLink>
        </div>
        <div>
          <StandardLink href="https://iconscout.com/icons/redux">
            Redux Logo Icon
          </StandardLink>
          {' by '}
          <StandardLink href="https://iconscout.com/contributors/icon-mafia">
            Icon Mafia
          </StandardLink>
        </div>
        <div>
          <StandardLink href="https://www.python.org/community/logos/">
            Python-logo
          </StandardLink>
          {' / '}
          <StandardLink href="https://www.python.org/psf/trademarks/">
            PSF Trademark Usage Policy
          </StandardLink>
        </div>
        <div>
          <StandardLink href="https://icon-icons.com/icon/file-type-django/130645">
            Django Icon
          </StandardLink>
          {' / '}
          <StandardLink href="https://creativecommons.org/licenses/by/4.0/">
            CC BY 4.0
          </StandardLink>
        </div>
      </Box>
    </Fragment>
  );
};

export default TechStackContent;
