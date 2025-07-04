import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Fragment } from 'react';
import { HtmlTooltip } from '@src/components/atoms/HtmlTooltip/HtmlTooltip';
import { StandardLink } from '@src/components/atoms/StandardLink/StandardLink';
import { Trans, useTranslation } from 'react-i18next';

const PC_SCREEN_MIN_WIDTH = '(min-width:1024px)'; // lg breakpoint

export const TechStackContent = () => {
  const isLightMode = useTheme().palette.mode === 'light';
  const pcScreen = useMediaQuery(PC_SCREEN_MIN_WIDTH);
  const { t } = useTranslation();

  const techInfoRows: TechInfoRowProps[] = [
    {
      text: t('about_page.tech_stack.frontend_code'),
      icons: [
        { path: 'React.svg', class: 'h-10' },
        {
          path: 'Typescript.svg',
          class: 'h-10 sm:ml-10 max-sm:ml-6',
        },
        {
          path: 'ReactQuery.svg',
          class: 'h-10 sm:ml-10 max-sm:ml-6',
        },
        {
          path: 'Zustand.png',
          class: 'h-10 sm:ml-10 max-sm:ml-6',
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
      icons: [{ path: 'Storybook.png', class: 'h-10' }],
    },
    {
      text: t('about_page.tech_stack.frontend_ui'),
      icons: [{ path: 'MUI.svg', class: 'h-10' }],
    },
    {
      text: t('about_page.tech_stack.frontend_host'),
      icons: [
        {
          path: isLightMode ? 'Netlify.svg' : 'Netlify-white.svg',
          class: 'h-10',
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_code'),
      icons: [
        {
          path: isLightMode ? 'Python.svg' : 'Python-white.svg',
          class: 'h-10 -mb-1',
        },
        {
          path: 'Django.svg',
          class: 'h-10 sm:ml-10 max-sm:ml-6',
        },
        {
          path: isLightMode ? 'SQLite.svg' : 'SQLite-white.png',
          class: 'h-10 sm:ml-10 max-sm:ml-6',
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_server'),
      icons: [
        {
          path: isLightMode ? 'Gunicorn.png' : 'Gunicorn-white.png',
          class: 'sm:h-10 max-sm:h-[35px]',
        },
        {
          path: 'Nginx.svg',
          class: 'sm:h-8 sm:my-1 max-sm:h-6 sm:ml-10 max-sm:ml-6',
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_container'),
      icons: [
        {
          path: isLightMode ? 'Docker.png' : 'Docker-white.png',
          class: 'h-10',
        },
      ],
    },
    {
      text: t('about_page.tech_stack.backend_host'),
      icons: [
        { path: 'Digitalocean.svg', class: 'sm:h-10 max-sm:h-[35px]' },
        {
          path: 'Ubuntu.svg',
          class: 'h-10 sm:ml-10 max-sm:ml-6',
        },
      ],
    },
    {
      text: t('about_page.tech_stack.music_info'),
      icons: [
        { path: 'Spotify.png', class: 'h-10' },
        {
          path: 'OAuth2.png',
          class: 'h-10 sm:ml-10 max-sm:ml-6',
        },
      ],
    },
    {
      text: t('about_page.tech_stack.festival_info'),
      icons: [
        {
          path: isLightMode ? 'MFW.png' : 'MFW-white.png',
          class: 'h-10',
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
          class: 'sm:h-8 sm:my-1 max-sm:h-6',
        },
      ],
    },
    {
      text: t('about_page.tech_stack.domain'),
      icons: [
        {
          path: isLightMode ? 'Namecheap.svg' : 'Namecheap-white.png',
          class: 'sm:h-10 max-sm:h-[35px]',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-2 max-lg:max-w-120">
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
        <div className="mt-8 flex flex-row">
          <Typography variant="body1" sx={{ mr: 1 }}>
            Icon licenses
          </Typography>
          <InfoOutlinedIcon />
        </div>
      </HtmlTooltip>
    </div>
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
        <div className="flex max-lg:items-center max-lg:justify-center lg:flex-row-reverse">
          <Typography variant="body1" className="max-sm:text-center">
            {text}
          </Typography>
        </div>
      </Grid>
      <Grid size={pcScreen ? 6 : 12}>
        <div className="flex flex-row items-center max-lg:mb-10 max-lg:justify-center lg:ml-10">
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
