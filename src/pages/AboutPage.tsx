import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CampaignTwoToneIcon from '@mui/icons-material/CampaignTwoTone';
import CodeIcon from '@mui/icons-material/Code';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import FestivalTwoToneIcon from '@mui/icons-material/FestivalTwoTone';
import Groups2TwoToneIcon from '@mui/icons-material/Groups2TwoTone';
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import StarRateTwoToneIcon from '@mui/icons-material/StarRateTwoTone';
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import clsx from 'clsx';
import { useState } from 'react';
import ExpandButton from '../components/atoms/ExpandButton/ExpandButton';
import StandardLink from '../components/atoms/StandardLink/StandardLink';
import TechStackContent from '../components/templates/TechStackContent/TechStackContent';
import TopLeftBackButtonContainer from '../containers/TopLeftBackButtonContainer';
import '../styles/base.scss';
import styles from './AboutPage.module.scss';
import { Trans, useTranslation } from 'react-i18next';

const AboutPage = () => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const biggerScreen = useMediaQuery('(min-width:720px)');
  const bigPcScreen = useMediaQuery('(min-width:1300px)');
  const { t } = useTranslation('translation', { keyPrefix: 'about_page' });

  const [techExpanded, setTechExpanded] = useState(false);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  const isLightMode = useTheme().palette.mode === 'light';

  const { PUBLIC_URL } = process.env;

  return (
    <>
      {bigPcScreen && <TopLeftBackButtonContainer />}
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
            <CustomListItem
              text={t('features.matching')}
              Icon={<LibraryMusicTwoToneIcon fontSize="large" color="info" />}
            />
            <CustomListItem
              text={t('features.festivals')}
              Icon={<FestivalTwoToneIcon fontSize="large" color="error" />}
            />
            <CustomListItem
              text={t('features.artists')}
              Icon={<Groups2TwoToneIcon fontSize="large" color="secondary" />}
            />
            <CustomListItem
              text={
                <Trans
                  i18nKey="about_page.features.code"
                  components={{ Link: <StandardLink /> }}
                />
              }
              Icon={<CodeIcon fontSize="large" color="success" />}
            />
            <CustomListItem
              text={
                <Trans
                  i18nKey="about_page.features.storybook"
                  components={{ Link: <StandardLink /> }}
                />
              }
              Icon={<EngineeringTwoToneIcon fontSize="large" color="warning" />}
            />
          </List>
        </Box>
        <Box className={styles.techBox}>
          <Paper
            elevation={3}
            className={clsx(styles.paper, styles.minWidth400)}
          >
            <div
              className={styles.rowFlexCenterSpaceApart}
              onClick={() => setTechExpanded(!techExpanded)}
            >
              <ExpandButton expanded={techExpanded} />
              <Typography variant="h5" sx={{ cursor: 'pointer' }}>
                Technology stack
              </Typography>
              <ExpandButton expanded={techExpanded} />
            </div>
            <Collapse in={techExpanded} timeout="auto" unmountOnExit>
              <TechStackContent />
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
            className={clsx(styles.paper, styles.minWidth400)}
          >
            <div
              className={styles.rowFlexCenterSpaceApart}
              onClick={() => setSupportExpanded(!supportExpanded)}
            >
              <ExpandButton expanded={supportExpanded} />
              <Typography variant="h5" sx={{ cursor: 'pointer' }}>
                Ways to support
              </Typography>
              <ExpandButton expanded={supportExpanded} />
            </div>
            <Collapse in={supportExpanded} timeout="auto" unmountOnExit>
              <div className={styles.expandedDiv}>
                <List className={styles.noPadding}>
                  <CustomListItem
                    text={
                      <ListItemText primary="Spread the word! Share your matching results and tell everyone about Oskarito SpotiFest" />
                    }
                    Icon={
                      <CampaignTwoToneIcon fontSize="large" color="primary" />
                    }
                  />
                  <CustomListItem
                    text={
                      <ListItemText primary="Buy your festival tickets through the ticket links on the site" />
                    }
                    Icon={
                      <CurrencyBitcoinIcon fontSize="large" color="warning" />
                    }
                  />
                  <CustomListItem
                    text={
                      <ListItemText
                        key="github"
                        disableTypography
                        className={styles.adjustTextForStar}
                      >
                        <Typography variant="body1">
                          Give the code a{' '}
                        </Typography>
                        <StarRateTwoToneIcon className={styles.starIcon} />
                        <Typography variant="body1">
                          {' on '}
                          <StandardLink href="https://github.com/OskarAsplin/spotifest">
                            GitHub
                          </StandardLink>
                        </Typography>
                      </ListItemText>
                    }
                    Icon={<StarRateTwoToneIcon fontSize="large" />}
                  />
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
            <div
              className={styles.rowFlexCenterSpaceApart}
              onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
            >
              <ExpandButton expanded={disclaimerExpanded} />
              <Typography variant="h5" sx={{ cursor: 'pointer' }}>
                Disclaimer
              </Typography>
              <ExpandButton expanded={disclaimerExpanded} />
            </div>
            <Collapse in={disclaimerExpanded} timeout="auto" unmountOnExit>
              <div className={styles.expandedDiv}>
                <Typography variant="body1" className={styles.textAlign}>
                  The creator of Oskarito SpotiFest takes no responsibility for
                  any inaccuracies in the information on the site, as this is
                  purely a hobby project at this point. No personal data is
                  collected by this site, but youtube videos showed on the
                  festival pages collect cookies. When logging out or going to{' '}
                  <StandardLink to="/login">spotifest.app/login</StandardLink>,
                  all browser data linked to the site is deleted.
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
                className={clsx(
                  styles.creatorImgBox,
                  isLightMode ? styles.roundedCorners : styles.darkerBackground
                )}
              >
                <img
                  src={PUBLIC_URL + '/creator_image_cropped.jpg'}
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
                      src={PUBLIC_URL + '/techIcons/LinkedIn-Bug.png'}
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
                      src={`${PUBLIC_URL}/techIcons/GitHub-Mark${
                        isLightMode ? '' : '-white'
                      }.png`}
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

interface CustomListItemProps {
  text: string | React.ReactNode;
  Icon: JSX.Element;
}

const CustomListItem = ({ text, Icon }: CustomListItemProps) => (
  <ListItem>
    <ListItemIcon>{Icon}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

export default AboutPage;
