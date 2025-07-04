import CampaignTwoToneIcon from '@mui/icons-material/CampaignTwoTone';
import CodeIcon from '@mui/icons-material/Code';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import FestivalTwoToneIcon from '@mui/icons-material/FestivalTwoTone';
import Groups2TwoToneIcon from '@mui/icons-material/Groups2TwoTone';
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import StarRateTwoToneIcon from '@mui/icons-material/StarRateTwoTone';
import {
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
import { clsx } from 'clsx';
import { useState } from 'react';
import { ExpandButton } from '@src/components/atoms/ExpandButton/ExpandButton';
import { StandardLink } from '@src/components/atoms/StandardLink/StandardLink';
import { TechStackContent } from '@src/components/templates/TechStackContent/TechStackContent';
import { Trans, useTranslation } from 'react-i18next';

export const AboutPage = () => {
  const bigScreen = useMediaQuery('(min-width:640px)'); // sm breakpoint
  const { t } = useTranslation();

  const isLightMode = useTheme().palette.mode === 'light';

  return (
    <>
      <div className="mt-2" />
      <div className="flex w-full flex-col items-center justify-center max-sm:p-0 sm:p-0 sm:pb-2">
        <div className="mx-4 mb-4 max-w-160">
          <Typography
            variant={bigScreen ? 'h4' : 'h5'}
            sx={{ textAlign: 'center', my: 2 }}
          >
            {t('about_page.features.title')}
          </Typography>
          <div className="mt-2" />
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
        </div>
        <CollapsibleCard title={t('about_page.tech_stack.title')}>
          <TechStackContent />
        </CollapsibleCard>
        <CollapsibleCard title={t('about_page.support.title')}>
          <div className="flex w-full max-w-120 flex-col items-center justify-center py-2">
            <List sx={{ p: 0 }}>
              <CustomListItem
                text={<ListItemText primary={t('about_page.support.share')} />}
                Icon={<CampaignTwoToneIcon fontSize="large" color="primary" />}
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
        </CollapsibleCard>
        <CollapsibleCard title={t('about_page.disclaimer.title')}>
          <div className="flex w-full max-w-120 flex-col items-center justify-center py-2">
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              {t('about_page.disclaimer.text')}
            </Typography>
          </div>
        </CollapsibleCard>
        <div className="mt-6 max-lg:w-100 max-sm:w-full sm:mb-2 lg:w-full lg:max-w-100">
          <Paper
            elevation={3}
            className="flex w-full max-w-150 flex-col items-center justify-center px-0 py-2 max-sm:max-w-full"
            square={!bigScreen}
          >
            <div className="flex w-full flex-col items-center justify-center">
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                {t('about_page.creator.title')}
              </Typography>
              <div
                className={clsx(
                  'mx-0 my-2 flex w-full flex-col items-center justify-center',
                  isLightMode ? 'rounded-sm' : 'bg-darker',
                )}
              >
                <img
                  src="/creator_image_cropped.jpg"
                  className="w-3/4 max-w-[300px]"
                  alt="Creator"
                />
              </div>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {t('about_page.creator.text')}
              </Typography>
              <div>
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
        </div>
      </div>
    </>
  );
};

const CollapsibleCard = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  const bigScreen = useMediaQuery('(min-width:640px)'); // sm breakpoint

  return (
    <div className="mx-4 mb-4 max-lg:max-w-650 max-sm:w-full lg:max-w-250">
      <Paper
        elevation={3}
        className="flex flex-col items-center justify-center py-1 max-sm:w-full max-sm:px-4 sm:min-w-100 sm:px-6"
        square={!bigScreen}
      >
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex w-full max-w-[330px] cursor-pointer flex-row items-center justify-between"
        >
          <ExpandButton expanded={expanded} />
          <Typography variant="h5" sx={{ cursor: 'pointer' }}>
            {title}
          </Typography>
          <ExpandButton expanded={expanded} />
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      </Paper>
    </div>
  );
};

interface CustomListItemProps {
  text: string | React.ReactNode;
  Icon: React.ReactElement;
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
    <img
      src={`/techIcons/GitHub-Mark${isLightMode ? '-white' : ''}.png`}
      alt="GitHub"
      className="h-10 w-10"
    />
  );
};

const LinkedInIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2867b2]">
    <img
      src="/techIcons/LinkedIn-Bug.png"
      alt="LinkedIn"
      className="mb-0.5 ml-0.5 h-4.5 w-4.5"
    />
  </div>
);
