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
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import { useState } from 'react';
import ExpandButton from '../components/atoms/ExpandButton/ExpandButton';
import { StandardLink } from '../components/atoms/StandardLink/StandardLink';
import TechStackContent from '../components/templates/TechStackContent/TechStackContent';
import '../styles/base.scss';
import styles from './AboutPage.module.scss';
import { Trans, useTranslation } from 'react-i18next';

const AboutPage = () => {
  const bigScreen = useMediaQuery('(min-width:610px)');
  const biggerScreen = useMediaQuery('(min-width:720px)');
  const { t } = useTranslation();

  const [techExpanded, setTechExpanded] = useState(false);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  const isLightMode = useTheme().palette.mode === 'light';

  return (
    <>
      <div className={styles.verticalSpace} />
      <div className={styles.verticalSpace} />

      <div className={styles.root}>
        <Box className={styles.box}>
          <Typography
            variant={bigScreen ? 'h4' : 'h5'}
            sx={{ textAlign: 'center', my: 2 }}
          >
            {t('about_page.features.title')}
          </Typography>
          <div className={styles.verticalSpace} />
          <List sx={{ p: 0 }}>
            <CustomListItem
              text={t('about_page.features.matching')}
              Icon={<LibraryMusicTwoToneIcon fontSize="large" color="info" />}
            />
            <CustomListItem
              text={t('about_page.features.festivals')}
              Icon={<FestivalTwoToneIcon fontSize="large" color="error" />}
            />
            <CustomListItem
              text={t('about_page.features.artists')}
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
                {t('about_page.tech_stack.title')}
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
                {t('about_page.support.title')}
              </Typography>
              <ExpandButton expanded={supportExpanded} />
            </div>
            <Collapse in={supportExpanded} timeout="auto" unmountOnExit>
              <div className={styles.expandedDiv}>
                <List className={styles.noPadding}>
                  <CustomListItem
                    text={
                      <ListItemText primary={t('about_page.support.share')} />
                    }
                    Icon={
                      <CampaignTwoToneIcon fontSize="large" color="primary" />
                    }
                  />
                  <CustomListItem
                    text={
                      <ListItemText>
                        <Trans
                          i18nKey="about_page.support.code"
                          components={{
                            StarIcon: <StarRateTwoToneIcon sx={{ my: -0.5 }} />,
                            Link: <StandardLink />,
                          }}
                        />
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
                {t('about_page.disclaimer.title')}
              </Typography>
              <ExpandButton expanded={disclaimerExpanded} />
            </div>
            <Collapse in={disclaimerExpanded} timeout="auto" unmountOnExit>
              <div className={styles.expandedDiv}>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  {t('about_page.disclaimer.text')}
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
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                {t('about_page.creator.title')}
              </Typography>
              <Box
                className={clsx(
                  styles.creatorImgBox,
                  isLightMode ? styles.roundedCorners : styles.darkerBackground,
                )}
              >
                <img
                  src="/creator_image_cropped.jpg"
                  className={styles.creatorImage}
                  alt="Creator"
                />
              </Box>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {t('about_page.creator.text')}
              </Typography>
              <div className={styles.rowFlexCenter}>
                <IconButton
                  href="https://www.linkedin.com/in/oskar-asplin-22796314a"
                  target="_blank"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  href="https://github.com/OskarAsplin"
                  target="_blank"
                >
                  <GithubIcon />
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

const GithubIcon = () => {
  const isLightMode = useTheme().palette.mode === 'light';

  return (
    <Box
      component="img"
      src={`/techIcons/GitHub-Mark${isLightMode ? '-white' : ''}.png`}
      alt="GitHub"
      sx={{
        width: ({ spacing }) => spacing(5),
        height: ({ spacing }) => spacing(5),
      }}
    />
  );
};

const LinkedInIcon = () => (
  <Box
    sx={{
      width: ({ spacing }) => spacing(5),
      height: ({ spacing }) => spacing(5),
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2867b2',
    }}
  >
    <Box
      component="img"
      src="/techIcons/LinkedIn-Bug.png"
      alt="LinkedIn"
      sx={{ mb: 0.25, ml: 0.25, width: '18px', height: '18px' }}
    />
  </Box>
);

export default AboutPage;
