import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import PublicIcon from '@mui/icons-material/Public';
import {
  Box,
  Button,
  Paper,
  Tab,
  tabClasses,
  Tabs,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/lazy';
import { useParams } from '@tanstack/router';
import SwipeableViews from 'react-swipeable-views';
import { useApiQuery, withFallback } from '../api/api';
import { getDjangoFestival } from '../api/djangoApi';
import CustomSwitch from '../components/atoms/CustomSwitch/CustomSwitch';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import { StyledAvatarContainerdiv } from '../components/molecules/ArtistBubble/ArtistBubble';
import StyledCookieConsent from '../components/molecules/CookieConsent';
import TabPanel from '../components/molecules/TabPanel';
import ArtistBubbleContainer from '../containers/ArtistBubbleContainer';
import TopLeftBackButtonContainer from '../containers/TopLeftBackButtonContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { StyledCenteredColumnDiv } from '../layouts/StyledLayoutComponents';
import '../styles/base.scss';
import { getCancelledDateString } from '../utils/dateUtils';
import {
  displayedLocationName,
  getMaxArtistsInFullLineupWidth,
} from '../utils/displayUtils';

const SuspenseFallback = () => <CenteredLoadingSpinner />;

const FestivalPage = withFallback(
  SuspenseFallback,
  ErrorFallback
)(() => {
  const boxForLineups = useMediaQuery('(min-width:1182px)');
  const mediumScreen = useMediaQuery('(min-width:610px)');
  const smallScreen = useMediaQuery('(max-width:440px)');
  const bigScreen = useMediaQuery('(min-width:690px)');
  const pcScreen = useMediaQuery('(min-width:1300px)');
  const videoSizeMax = useMediaQuery('(min-width:770px)');
  const videoSizeSmall = useMediaQuery('(max-width:470px)');

  const { t } = useTranslation();
  const themeDirection = useTheme().direction;
  const { festivalId } = useParams();

  const { data: festivalInfo } = useApiQuery(getDjangoFestival, {
    query: { name: festivalId ?? '' },
    enabled: !!festivalId,
  });

  const limitLineups = !mediumScreen ? 4 : undefined;

  const maxArtistsInLineupsWidth = getMaxArtistsInFullLineupWidth(
    bigScreen,
    smallScreen,
    11
  );

  const [selectedLineup, setSelectedLineup] = useState(0);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  if (!festivalId)
    return <ErrorFallback fallbackText={t('error.invalid_url')} />;
  if (!festivalInfo)
    return <ErrorFallback fallbackText={t('error.festival_not_found')} />;

  return (
    <>
      {pcScreen && <TopLeftBackButtonContainer />}
      <VerticalSpaceDiv />
      <StyledCenteredColumnDiv>
        <StyledRootDiv>
          <Box sx={{ width: '100%', maxWidth: '750px', mt: 0, mb: 2, mx: 2 }}>
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 1,
                '@media (min-width: 690px)': { px: 4 },
                '@media (max-width: 689px)': {
                  '@media (min-width: 440px)': { px: 2 },
                },
                '@media (max-width: 439px)': { px: 2 },
              }}
            >
              <Typography
                variant={bigScreen ? 'h3' : 'h4'}
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {festivalInfo.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                {displayedLocationName(festivalInfo.locationText)}
                <ReactCountryFlag
                  countryCode={festivalInfo.country}
                  svg
                  style={{ marginLeft: '8px' }}
                />
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ m: 1, textAlign: 'center' }}
              >
                {`${t('common.genres')}: ${festivalInfo.genres.join(', ')}`}
              </Typography>
              <div>
                {festivalInfo.webpage && (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ p: 1, minWidth: 0, mx: 2, my: 1, borderRadius: 2 }}
                    href={festivalInfo.webpage}
                    target="_blank"
                  >
                    <PublicIcon />
                  </Button>
                )}
                {festivalInfo.ticketWebpage && (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ p: 1, minWidth: 0, mx: 2, my: 1, borderRadius: 2 }}
                    href={festivalInfo.ticketWebpage}
                    target="_blank"
                  >
                    <LocalActivityIcon />
                  </Button>
                )}
              </div>
            </Paper>
          </Box>
          {festivalInfo.video && (
            <Box sx={{ mb: 2 }}>
              <StyledVideoPaper elevation={3}>
                <ReactPlayer
                  url={festivalInfo.video}
                  controls
                  data-cookiescript="accepted"
                  data-cookiecategory="functionality"
                  width={
                    videoSizeMax
                      ? undefined
                      : mediumScreen
                      ? 496
                      : videoSizeSmall
                      ? '100%'
                      : 400
                  }
                  height={
                    videoSizeMax
                      ? undefined
                      : mediumScreen
                      ? 279
                      : videoSizeSmall
                      ? '100%'
                      : 225
                  }
                />
              </StyledVideoPaper>
            </Box>
          )}
        </StyledRootDiv>
        {festivalInfo.lineups.length !== 0 && (
          <Box sx={{ width: '100%', maxWidth: '1150px', my: 0, mx: 2 }}>
            <StyledLineupPaper square={!boxForLineups} elevation={3}>
              <Tabs
                centered
                value={selectedLineup}
                indicatorColor="primary"
                textColor="primary"
                onChange={(event: React.ChangeEvent<{}>, newValue: number) =>
                  setSelectedLineup(newValue)
                }
                aria-label="lineups"
              >
                {festivalInfo.lineups
                  .slice(0, limitLineups)
                  .map((lineup, idx) => (
                    <StyledTab
                      label={
                        <span style={{ fontSize: '20px' }}>{lineup.year}</span>
                      }
                      value={idx}
                      key={'tab: ' + festivalInfo.name + lineup.year}
                    />
                  ))}
              </Tabs>
              <SwipeableViews
                axis={themeDirection === 'rtl' ? 'x-reverse' : 'x'}
                index={selectedLineup}
                onChangeIndex={(newValue: number) =>
                  setSelectedLineup(newValue)
                }
              >
                {festivalInfo.lineups
                  .slice(0, limitLineups)
                  .map((lineup, idx) => (
                    <TabPanel
                      key={'tabPanel: ' + festivalInfo.name + lineup.year}
                      value={selectedLineup}
                      index={idx}
                    >
                      {lineup.artists.length === 0 ? (
                        <StyledCenteredColumnDiv>
                          <Typography variant="h6">
                            {t('common.no_lineup')}
                          </Typography>
                        </StyledCenteredColumnDiv>
                      ) : (
                        <StyledCenteredColumnDiv>
                          {lineup.cancelled ? (
                            <Typography variant="h6" color="secondary">
                              {getCancelledDateString(lineup.date_str)}
                            </Typography>
                          ) : (
                            <Typography variant="h5">
                              {lineup.date_str}
                            </Typography>
                          )}
                          <CustomSwitch
                            checked={sortAlphabetically}
                            setChecked={setSortAlphabetically}
                            leftOptionText={t('common.popularity')}
                            rightOptionText={t('common.alphabetically')}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                              width: '99%',
                            }}
                          >
                            {lineup.artists.length > 0 &&
                              lineup.artists
                                .sort((a, b) =>
                                  (
                                    sortAlphabetically
                                      ? a.name > b.name
                                      : a.popularity < b.popularity
                                  )
                                    ? 1
                                    : -1
                                )
                                .map((artist) => (
                                  <ArtistBubbleContainer
                                    key={`avatar_festival_lineup_artist_${festivalInfo.name}${lineup.year}${artist.name}`}
                                    artist={artist}
                                  />
                                ))}
                            {lineup.artists.length > 0 &&
                              Array.from(
                                {
                                  length:
                                    maxArtistsInLineupsWidth -
                                    (lineup.artists.length %
                                      maxArtistsInLineupsWidth),
                                },
                                (_, i) => <StyledAvatarContainerdiv key={i} />
                              )}
                          </Box>
                        </StyledCenteredColumnDiv>
                      )}
                    </TabPanel>
                  ))}
              </SwipeableViews>
            </StyledLineupPaper>
          </Box>
        )}
      </StyledCenteredColumnDiv>
      {festivalInfo.video && (
        <StyledCookieConsent>{t('cookies.youtube')}</StyledCookieConsent>
      )}
    </>
  );
});

const StyledRootDiv = styled('div')(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  '@media (min-width: 440px)': { padding: spacing(0, 2) },
  '@media (max-width: 439px)': { padding: spacing(0, 1) },
}));

const StyledLineupPaper = styled(Paper)(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  '@media (min-width: 1182px)': { marginBottom: spacing(2) },
  '@media (min-width: 440px)': { padding: spacing(0, 2) },
  '@media (max-width: 439px)': { padding: spacing(0, 1) },
}));

const StyledVideoPaper = styled(Paper)(({ theme: { spacing } }) => ({
  '@media (min-width: 610px)': { padding: spacing(2, 4) },
  '@media (max-width: 609px)': {
    '@media (min-width: 349px)': { padding: spacing(1, 2) },
  },
  '@media (max-width: 348px)': { padding: spacing(1) },
}));

const StyledTab = styled(Tab)(() => ({
  [`&.${tabClasses.root}`]: {
    '@media (min-width: 900px)': { minWidth: '160px' },
    '@media (min-width: 610px)': {
      '@media (max-width: 899px)': { minWidth: '100px' },
    },
    '@media (max-width: 609px)': { minWidth: '72px' },
  },
}));

const VerticalSpaceDiv = styled('div')(({ theme: { spacing } }) => ({
  '@media (min-width: 610px)': { padding: spacing(2) },
  '@media (max-width: 609px)': { padding: spacing(1) },
  width: '100%',
}));

export default FestivalPage;
