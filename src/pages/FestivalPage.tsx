import { Ticket, Globe } from 'lucide-react';
import { useMediaQuery } from '@src/hooks/useMediaQuery';
import { Button } from '@src/components/ui/button';
import { Card, CardContent } from '@src/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@src/components/ui/tabs';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { useApiSuspenseQuery, withFallback } from '@src/api/api';
import { getDjangoFestival } from '@src/api/djangoApi';
import { CustomSwitch } from '@src/components/atoms/CustomSwitch/CustomSwitch';
import { CenteredLoadingSpinner } from '@src/components/atoms/LoadingSpinner/LoadingSpinner';
import {
  ArtistBubble,
  StyledAvatarContainerDiv,
} from '@src/components/molecules/ArtistBubble/ArtistBubble';
import { CookieConsent } from '@src/components/molecules/CookieConsent';
import { ErrorFallback } from '@src/layouts/ErrorFallback';
import { getCancelledDateString } from '@src/utils/dateUtils';
import {
  displayedLocationName,
  getMaxArtistsInWidth,
  useMeasure,
} from '@src/utils/displayUtils';
import { getRouteApi } from '@tanstack/react-router';
import { Lineup } from '@src/api/types';
import { ArtistBox } from '@src/components/organisms/FestivalMatchCard/FestivalMatchCard';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const FestivalPageErrorFallback = () => {
  const { t } = useTranslation();

  return <ErrorFallback fallbackText={t('error.festival_not_found')} />;
};

const route = getRouteApi('/_withLayout/festival/$festivalId');

export const FestivalPage = withFallback(
  SuspenseFallback,
  FestivalPageErrorFallback,
)(() => {
  const videoSizeMax = useMediaQuery('(min-width:768px)');
  const bigScreen = useMediaQuery('(min-width:640px)');
  const { t } = useTranslation();
  const { festivalId } = route.useParams();

  const { data: festivalInfo } = useApiSuspenseQuery(getDjangoFestival, {
    params: { name: festivalId },
  });

  const limitLineups = bigScreen ? 7 : 4;

  const [selectedLineup, setSelectedLineup] = useState(0);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [ref, { width }] = useMeasure();

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <div className="flex w-full flex-col items-center px-2 sm:px-4">
          <div className="mx-2 w-full max-w-2xl">
            <Card className="w-full shadow-lg">
              <CardContent className="flex flex-col items-center py-2 sm:py-4">
                <h1 className="mb-2 w-full text-center text-2xl font-bold sm:text-3xl">
                  {festivalInfo.name}
                </h1>
                <p className="text-center text-lg">
                  {displayedLocationName(festivalInfo.locationText)}
                  <ReactCountryFlag
                    countryCode={festivalInfo.country}
                    svg
                    style={{ marginLeft: '8px' }}
                  />
                </p>
                <p className="m-2 text-center text-lg">
                  {`${t('common.genres')}: ${festivalInfo.genres.join(', ')}`}
                </p>
                <div className="mt-2 flex gap-2">
                  {festivalInfo.webpage && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg p-2"
                      asChild
                    >
                      <a
                        href={festivalInfo.webpage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {festivalInfo.ticketWebpage && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg p-2"
                      asChild
                    >
                      <a
                        href={festivalInfo.ticketWebpage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Ticket className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {festivalInfo.video && (
          <Card className="p-2 shadow-lg sm:p-4">
            <ReactPlayer
              src={festivalInfo.video}
              controls
              data-cookiescript="accepted"
              data-cookiecategory="functionality"
              width={videoSizeMax ? undefined : bigScreen ? 496 : '100%'}
              height={videoSizeMax ? undefined : bigScreen ? 279 : '100%'}
            />
          </Card>
        )}
        {festivalInfo.lineups.length !== 0 && (
          <div className="my-0 w-full max-w-6xl lg:px-2">
            <Card className="flex w-full flex-col items-center justify-center rounded-none px-1 pb-2 shadow-lg sm:px-2 sm:pb-4 lg:mb-2 lg:rounded-lg">
              <Tabs
                value={selectedLineup.toString()}
                onValueChange={(value) => setSelectedLineup(parseInt(value))}
                ref={ref}
              >
                <TabsList className="w-full justify-center bg-transparent">
                  {festivalInfo.lineups
                    .slice(0, limitLineups)
                    .map((lineup, idx) => (
                      <TabsTrigger
                        key={'tab: ' + festivalInfo.name + lineup.year}
                        value={idx.toString()}
                        className="text-xl"
                      >
                        {lineup.year}
                      </TabsTrigger>
                    ))}
                </TabsList>
                {festivalInfo.lineups
                  .slice(0, limitLineups)
                  .map((lineup, idx) => (
                    <TabsContent
                      key={'tabPanel: ' + festivalInfo.name + lineup.year}
                      value={idx.toString()}
                      className="w-full"
                    >
                      {lineup.artists.length === 0 ? (
                        <div className="flex w-full flex-col items-center justify-center">
                          <h3 className="text-lg font-semibold">
                            {t('common.no_lineup')}
                          </h3>
                        </div>
                      ) : (
                        <LineupArtists
                          lineup={lineup}
                          width={width}
                          sortAlphabetically={sortAlphabetically}
                          setSortAlphabetically={setSortAlphabetically}
                        />
                      )}
                    </TabsContent>
                  ))}
              </Tabs>
            </Card>
          </div>
        )}
      </div>
      {festivalInfo.video && (
        <CookieConsent
          variant="mini"
          hideDecline
          description={t('cookies.youtube')}
        />
      )}
    </>
  );
});

const LineupArtists = ({
  lineup,
  width,
  sortAlphabetically,
  setSortAlphabetically,
}: {
  lineup: Lineup;
  width: number;
  sortAlphabetically: boolean;
  setSortAlphabetically: (value: boolean) => void;
}) => {
  const { t } = useTranslation();
  const bigScreen = useMediaQuery('(min-width:640px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(width, bigScreen);
  const fillArtistWidth =
    maxArtistsInWidth - (lineup.artists.length % maxArtistsInWidth);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {lineup.cancelled ? (
        <h3 className="text-destructive text-lg font-semibold">
          {getCancelledDateString(lineup.date_str)}
        </h3>
      ) : (
        <h2 className="text-xl font-bold">{lineup.date_str}</h2>
      )}
      <CustomSwitch
        checked={sortAlphabetically}
        setChecked={setSortAlphabetically}
        leftOptionText={t('common.popularity')}
        rightOptionText={t('common.alphabetically')}
      />
      <ArtistBox>
        {lineup.artists.length > 0 &&
          lineup.artists
            .sort((a, b) =>
              (
                sortAlphabetically
                  ? a.name > b.name
                  : a.popularity === b.popularity
                    ? a.name > b.name
                    : a.popularity < b.popularity
              )
                ? 1
                : -1,
            )
            .map((artist) => (
              <ArtistBubble
                key={`avatar_festival_lineup_artist_${lineup.year}${artist.name}`}
                artist={artist}
              />
            ))}
        {lineup.artists.length > 0 &&
          Array.from({ length: fillArtistWidth }, (_, i) => (
            <StyledAvatarContainerDiv key={i} />
          ))}
      </ArtistBox>
    </div>
  );
};
