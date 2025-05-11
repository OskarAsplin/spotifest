import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import { Fragment } from 'react';
import aboutPageStyles from '@src/pages/AboutPage.module.scss';
import HtmlTooltip from '@src/components/atoms/HtmlTooltip/HtmlTooltip';
import { StandardLink } from '@src/components/atoms/StandardLink/StandardLink';
import styles from './TechStackContent.module.scss';
import { Trans, useTranslation } from 'react-i18next';

const PC_SCREEN_MIN_WIDTH = '(min-width:1040px)';

const TechStackContent = () => {
  const isLightMode = useTheme().palette.mode === 'light';
  const pcScreen = useMediaQuery(PC_SCREEN_MIN_WIDTH);
  const { t } = useTranslation();

  const techInfoRows: TechInfoRowProps[] = [
    {
      text: t('about_page.tech_stack.frontend_code'),
      icons: [
        { path: 'React.svg', class: styles.iconDefaultHeight },
        {
          path: 'Typescript.svg',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
        {
          path: 'ReactQuery.svg',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
        {
          path: 'Zustand.png',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: (
        <Trans
          i18nKey="about_page.tech_stack.frontend_storybook"
          components={{ Link: <StandardLink /> }}
        />
      ),
      icons: [{ path: 'Storybook.png', class: styles.iconDefaultHeight }],
    },
    {
      text: t('about_page.tech_stack.frontend_ui'),
      icons: [{ path: 'MUI.svg', class: styles.iconDefaultHeight }],
    },
    {
      text: t('about_page.tech_stack.frontend_host'),
      icons: [
        {
          path: isLightMode ? 'Netlify.svg' : 'Netlify-white.svg',
          class: styles.iconDefaultHeight,
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_code'),
      icons: [
        {
          path: isLightMode ? 'Python.svg' : 'Python-white.svg',
          class: clsx(styles.iconDefaultHeight, styles.pythonAdjustDown),
        },
        {
          path: 'Django.svg',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
        {
          path: isLightMode ? 'SQLite.svg' : 'SQLite-white.png',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_server'),
      icons: [
        {
          path: isLightMode ? 'Gunicorn.png' : 'Gunicorn-white.png',
          class: styles.mediumSize,
        },
        {
          path: 'Nginx.svg',
          class: clsx(styles.smallSize, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_container'),
      icons: [
        {
          path: isLightMode ? 'Docker.png' : 'Docker-white.png',
          class: styles.iconDefaultHeight,
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_host'),
      icons: [
        { path: 'Digitalocean.svg', class: styles.mediumSize },
        {
          path: 'Ubuntu.svg',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: t('about_page.tech_stack.music_info'),
      icons: [
        { path: 'Spotify.png', class: styles.iconDefaultHeight },
        {
          path: 'OAuth2.png',
          class: clsx(styles.iconDefaultHeight, styles.iconMarginLeft),
        },
      ],
    },
    {
      text: t('about_page.tech_stack.festival_info'),
      icons: [
        {
          path: isLightMode ? 'MFW.png' : 'MFW-white.png',
          class: styles.iconDefaultHeight,
        },
      ],
    },
    {
      text: (
        <Trans
          i18nKey="about_page.tech_stack.version_control"
          components={{ Link: <StandardLink /> }}
        />
      ),
      icons: [
        {
          path: isLightMode ? 'GitHub.png' : 'GitHub-white.png',
          class: styles.smallSize,
        },
      ],
    },
    {
      text: t('about_page.tech_stack.domain'),
      icons: [
        {
          path: isLightMode ? 'Namecheap.svg' : 'Namecheap-white.png',
          class: styles.mediumSize,
        },
      ],
    },
  ];

  return (
    <Fragment>
      <div className={aboutPageStyles.expandedDiv}>
        <Grid
          container
          spacing={pcScreen ? 3 : 1}
          justifyContent="center"
          alignItems="center"
        >
          {techInfoRows.map((techInfo, i) => (
            <TechInfoRow key={i} {...techInfo} />
          ))}
        </Grid>
        <HtmlTooltip
          disableFocusListener
          enterTouchDelay={0}
          title={
            <Fragment>
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
            </Fragment>
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}>
            <Typography variant="body1" sx={{ marginRight: 1 }}>
              Icon licenses
            </Typography>
            <InfoOutlinedIcon />
          </Box>
        </HtmlTooltip>
      </div>
    </Fragment>
  );
};

interface TechInfoRowProps {
  text: string | React.ReactNode;
  icons: { path: string; class: string }[];
}

const TechInfoRow = ({ text, icons }: TechInfoRowProps) => {
  const pcScreen = useMediaQuery(PC_SCREEN_MIN_WIDTH);
  return (
    <Fragment key={'techRow:' + text}>
      <Grid size={pcScreen ? 6 : 12}>
        <div className={styles.techInfoText}>
          <Typography variant="body1" className={styles.textAlign}>
            {text}
          </Typography>
        </div>
      </Grid>
      <Grid size={pcScreen ? 6 : 12}>
        <div className={styles.iconsContainer}>
          {icons.map((icon) => (
            <img
              src={'/techIcons/' + icon.path}
              key={icon.path}
              className={icon.class}
              alt={icon.path}
            />
          ))}
        </div>
      </Grid>
    </Fragment>
  );
};

export default TechStackContent;
