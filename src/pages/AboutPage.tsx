import { useState } from 'react';
import {
  Theme,
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { ArrowBackOutlined, MusicNote } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import clsx from 'clsx';
import { Navigate } from 'react-router-dom';
import TechStackContent from '../components/TechStackContent';
import '../styles/base.scss';
import styles from './AboutPage.module.scss';
import StandardLink from '../components/StandardLink';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  })
);

const AboutPage = () => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const biggerScreen = useMediaQuery('(min-width:720px)');
  const pcScreen = useMediaQuery('(min-width:1040px)');
  const bigPcScreen = useMediaQuery('(min-width:1300px)');

  const [navigateHome, setNavigateHome] = useState<boolean>(false);
  const [usageExpanded, setUsageExpanded] = useState(false);
  const [techExpanded, setTechExpanded] = useState(false);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  const themeMode = useTheme().palette.mode;

  const lightMode: boolean = themeMode === 'light';

  const classes = useStyles();

  if (navigateHome) return <Navigate to="/" />;

  return (
    <>
      {bigPcScreen && (
        <div className={styles.topLeft}>
          <IconButton
            onClick={() => {
              window.history.back();
              setTimeout(() => setNavigateHome(true), 10);
            }}
          >
            <ArrowBackOutlined fontSize="large" />
          </IconButton>
        </div>
      )}
      <div className={styles.verticalSpace} />
      <div className={styles.verticalSpace} />

      <div className={styles.root}>
        <Box className={styles.box}>
          <Typography
            variant={bigScreen ? 'h4' : 'h5'}
            className={clsx(styles.title, styles.textAlign)}
          >
            Oskarito SpotiFest features
          </Typography>
          <div className={styles.verticalSpace} />
          <List className={styles.noPadding}>
            {[
              'Festival matching with more than 1000 festivals worldwide',
              'Festival pages with current and previous lineups',
              'Artist pages to see which festivals each artist is attending',
            ].map((text, i) => {
              return (
                <ListItem key={'feature:' + i}>
                  <ListItemIcon>
                    <MusicNote fontSize={'large'} />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box className={styles.techBox}>
          <Paper
            elevation={3}
            className={clsx(styles.paper, styles.minWidth400)}
          >
            <div className={styles.rowFlexCenter}>
              <Typography
                variant="h5"
                onClick={() => setTechExpanded(!techExpanded)}
              >
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
              <TechStackContent pcScreen={pcScreen} lightMode={lightMode} />
            </Collapse>
          </Paper>
        </Box>
        <Box
          className={
            biggerScreen && supportExpanded
              ? styles.supportExpandedBox
              : styles.box
          }
        >
          <Paper
            elevation={3}
            className={clsx(styles.paperTop, styles.minWidth400)}
          >
            <div className={styles.rowFlexCenter}>
              <Typography
                variant="h5"
                onClick={() => setSupportExpanded(!supportExpanded)}
              >
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
              <div className={styles.expandedDiv}>
                <List className={styles.noPadding}>
                  {[
                    <ListItemText
                      key="spread"
                      primary="Spread the word! Tell everyone about Oskarito SpotiFest"
                    />,
                    <ListItemText
                      key="tickets"
                      primary="Buy your festival tickets through the ticket links on the site"
                    />,
                    <ListItemText
                      key="github"
                      disableTypography
                      className={styles.adjustTextForStar}
                    >
                      <Typography variant="body1">Give the code a </Typography>
                      <StarIcon className={styles.starIcon} />
                      <Typography variant="body1">
                        {' on '}
                        <StandardLink href="https://github.com/OskarAsplin/spotifest">
                          GitHub
                        </StandardLink>
                      </Typography>
                    </ListItemText>,
                  ].map((listItemText, idx) => {
                    return (
                      <ListItem key={'supportListItem: ' + idx}>
                        <ListItemIcon>
                          <MusicNote fontSize={'large'} />
                        </ListItemIcon>
                        {listItemText}
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </Collapse>
          </Paper>
        </Box>
        <Box className={styles.box}>
          <Paper
            elevation={3}
            className={clsx(styles.paper, styles.minWidth400)}
          >
            <div className={styles.rowFlexCenter}>
              <Typography
                variant="h5"
                onClick={() => setUsageExpanded(!usageExpanded)}
              >
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
              <div className={styles.expandedDiv}>
                <div className={styles.usageBox}>
                  <div className={styles.usagePart}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/usageImages/match-settings.jpg'
                      }
                      className={styles.usageImg}
                      alt="match-settings-box"
                    />
                    <Typography
                      variant="body1"
                      className={clsx(styles.textAlign, styles.usageText)}
                    >
                      {
                        'Adjust the match settings on the main page to get your festival matches.'
                      }
                    </Typography>
                  </div>
                  <div className={styles.usagePart}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/usageImages/festival-match-marked.jpg'
                      }
                      className={styles.usageImg}
                      alt="festival-match-marked"
                    />
                    <Typography
                      variant="body1"
                      className={clsx(styles.textAlign, styles.usageText)}
                    >
                      {
                        "Click on a festival title or image to see full lineups and more. Click on an artist icon to see the artist's future and past festivals and more. Click on 'popular artists at this festival' to see the most popular artists in the festival lineup."
                      }
                    </Typography>
                  </div>
                  <div className={styles.usagePart}>
                    <img
                      src={process.env.PUBLIC_URL + '/usageImages/top-bar.jpg'}
                      className={clsx(styles.usageImg, styles.topBarImg)}
                      alt="top-bar"
                    />
                    <Typography
                      variant="body1"
                      className={clsx(styles.textAlign, styles.usageText)}
                    >
                      {
                        "Clicking 'Oskarito SpotiFest' takes you back to the festival matching. Click the search icon to search for festivals and artists. Click the account avatar to log out. Click the hamburger menu to get to the about page or to switch between dark/light mode."
                      }
                    </Typography>
                  </div>
                </div>
              </div>
            </Collapse>
          </Paper>
        </Box>
        <Box className={styles.box}>
          <Paper
            elevation={3}
            className={clsx(styles.paper, styles.minWidth400)}
          >
            <div className={styles.rowFlexCenter}>
              <Typography
                variant="h5"
                onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
              >
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
              <div className={styles.expandedDiv}>
                <Typography variant="body1" className={styles.textAlign}>
                  The creator of Oskarito SpotiFest takes no responsibility for
                  any inaccuracies in the information on the site, as this is
                  purely a hobby project at this point. No personal data is
                  collected by this site, but youtube videos showed on the
                  festival pages collect cookies. When logging out or going to{' '}
                  <StandardLink href="https://www.spotifest.app/login">
                    spotifest.app/login
                  </StandardLink>
                  , all browser data linked to the site is deleted.
                </Typography>
              </div>
            </Collapse>
          </Paper>
        </Box>
        <Box className={styles.box2}>
          <Paper
            elevation={3}
            className={clsx(styles.creatorPaper, styles.maxWidth400)}
          >
            <div className={styles.flexColumn}>
              <Typography variant="h5" className={styles.textAlign}>
                Created by
              </Typography>
              <Box
                className={
                  lightMode
                    ? clsx(styles.creatorImgBox, styles.roundedCorners)
                    : clsx(styles.creatorImgBox, styles.darkerBackground)
                }
              >
                <img
                  src={process.env.PUBLIC_URL + '/creator_image_cropped.jpg'}
                  className={styles.creatorImage}
                  alt="Creator"
                />
              </Box>
              <Typography variant="h6" className={styles.textAlign}>
                Oskar Asplin
              </Typography>
              <div className={styles.rowFlexCenter}>
                <IconButton
                  onClick={() =>
                    window.open(
                      'https://www.linkedin.com/in/oskar-buset-asplin-22796314a',
                      '_blank'
                    )
                  }
                >
                  <div className={styles.linkedInSocialButton}>
                    <img
                      src={
                        process.env.PUBLIC_URL + '/techIcons/LinkedIn-Bug.png'
                      }
                      className={styles.linkeidInSocialBug}
                      alt="LinkedIn"
                    />
                  </div>
                </IconButton>
                <IconButton
                  onClick={() =>
                    window.open('https://github.com/OskarAsplin', '_blank')
                  }
                >
                  <div className={styles.socialButton}>
                    <img
                      src={
                        lightMode
                          ? process.env.PUBLIC_URL +
                            '/techIcons/GitHub-Mark.png'
                          : process.env.PUBLIC_URL +
                            '/techIcons/GitHub-Mark-white.png'
                      }
                      className={styles.githubSocialBug}
                      alt="GitHub"
                    />
                  </div>
                </IconButton>
              </div>
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default AboutPage;
