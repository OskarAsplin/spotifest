import { Music } from 'lucide-react';
import { Avatar, AvatarImage } from '@src/components/ui/avatar';
import { Button } from '@src/components/ui/button';
import { Card, CardContent } from '@src/components/ui/card';
import { cn } from '@src/lib/utils';
import { useTranslation } from 'react-i18next';
import { useApiSuspenseQuery, withFallback } from '@src/api/api';
import { getArtistInfoFromDjangoOrSpotify } from '@src/api/combinedApi';
import { CenteredLoadingSpinner } from '@src/components/atoms/LoadingSpinner/LoadingSpinner';
import { RelatedArtistsContainer } from '@src/containers/RelatedArtistsContainer';
import { ErrorFallback } from '@src/layouts/ErrorFallback';
import { getCancelledDateString } from '@src/utils/dateUtils';
import { useIsLoggedIn } from '@src/zustand/authStore';
import { FestivalMatchCard } from '@src/components/organisms/FestivalMatchCard/FestivalMatchCard';
import { getRouteApi, Link } from '@tanstack/react-router';
import {
  getMaxArtistsInFestivalMatchesWidth,
  useMeasure,
} from '@src/utils/displayUtils';
import { useMediaQuery } from '@src/hooks/useMediaQuery';

const getNameOrSpotifyIdFromUrl = (artistId: string) => {
  const hasSpotifyId = !!artistId && artistId.indexOf('spotifyId=') !== -1;
  if (!hasSpotifyId) return { name: artistId, spotifyId: undefined };
  const spotifyId = artistId.substring('spotifyId='.length) || undefined;
  return { spotifyId, name: undefined };
};

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const ArtistPageErrorFallback = () => {
  const { t } = useTranslation();

  return <ErrorFallback fallbackText={t('error.artist_not_found')} />;
};

const route = getRouteApi('/_withLayout/artist/$artistId');

export const ArtistPage = withFallback(
  SuspenseFallback,
  ArtistPageErrorFallback,
)(() => {
  const { artistId } = route.useParams();
  const { t } = useTranslation();

  const { name, spotifyId: spotifyIdFromUrl } =
    getNameOrSpotifyIdFromUrl(artistId);

  const isLoggedIn = useIsLoggedIn();

  const { data: artistInfo } = useApiSuspenseQuery(
    getArtistInfoFromDjangoOrSpotify,
    { params: { spotifyId: spotifyIdFromUrl, name, isLoggedIn } },
  );

  const spotifyId = spotifyIdFromUrl || artistInfo.artist.spotifyId;

  const isArtistInDb =
    artistInfo.festivalsFuture.length > 0 ||
    artistInfo.festivalsPast.length > 0;

  const bigScreen = useMediaQuery('(min-width:640px)');
  const [ref, { width }] = useMeasure();
  const maxArtistsInWidth = getMaxArtistsInFestivalMatchesWidth(
    width,
    bigScreen,
  );

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-6 px-2 sm:gap-8 sm:px-4">
        <Card className="max-w-170">
          <CardContent className="flex flex-col items-center py-4">
            <h1
              className={cn(
                'w-full text-center font-bold',
                'text-2xl sm:text-3xl',
              )}
            >
              {artistInfo.artist.name}
            </h1>
            <div className="mt-2 flex w-full items-center justify-center">
              {artistInfo.artist.bigPicture ? (
                <img
                  src={artistInfo.artist.bigPicture}
                  alt=""
                  className="max-h-[350px] max-w-full"
                />
              ) : (
                <div className="flex items-center justify-center py-6 text-[80px] sm:text-[150px]">
                  <Music className="h-[80px] w-[80px] text-[80px] sm:h-[150px] sm:w-[150px] sm:text-[150px]" />
                </div>
              )}
            </div>
            <p className="my-2 px-4 text-center text-base sm:px-8">
              {artistInfo.artist.genres.length > 0
                ? `${t('common.genres')}: ${artistInfo.artist.genres.join(', ')}`
                : t('common.no_genres')}
            </p>
            {spotifyId && (
              <Button
                variant="ghost"
                size="icon"
                className="mb-2 p-1.5"
                asChild
              >
                <a
                  href={`https://open.spotify.com/artist/${spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/techIcons/Spotify-Mark.png" alt="" />
                  </Avatar>
                </a>
              </Button>
            )}
            {isLoggedIn && !!spotifyId && (
              <RelatedArtistsContainer spotifyId={spotifyId} />
            )}
          </CardContent>
        </Card>
        {artistInfo.festivalsFuture.length !== 0 && (
          <div
            ref={ref}
            className="flex w-full max-w-3xl flex-col items-center justify-center"
          >
            <h2 className="mb-2 text-xl max-sm:text-center sm:text-2xl">
              {t('artist_page.future_festivals')}
            </h2>
            {artistInfo.festivalsFuture.map((festival) => (
              <FestivalMatchCard
                key={'FestivalMatchCard: ' + festival.name + festival.year}
                festival={festival}
                popularArtists={festival.popular_artists}
                maxArtistsInWidth={maxArtistsInWidth}
              />
            ))}
          </div>
        )}
        {artistInfo.festivalsPast.length !== 0 && (
          <div className="flex w-full flex-col items-center justify-center">
            <h2 className="mb-2 text-xl max-sm:text-center sm:text-2xl">
              {t('artist_page.past_festivals')}
            </h2>
            <div className="mb-4 w-full max-w-3xl space-y-2">
              {artistInfo.festivalsPast.map((festival) => (
                <Link
                  key={'past festival: ' + festival.name + festival.year}
                  to="/festival/$festivalId"
                  params={{ festivalId: encodeURIComponent(festival.name) }}
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="flex h-auto w-full flex-col items-center p-2 sm:p-4"
                  >
                    <h3
                      className={cn(
                        'text-center font-bold break-words',
                        'text-lg sm:text-2xl',
                      )}
                    >
                      {festival.name}
                    </h3>
                    {festival.cancelled ? (
                      <p className="text-destructive text-base">
                        {getCancelledDateString(festival.date, festival.year)}
                      </p>
                    ) : (
                      <p className="text-base">
                        {festival.date + ', ' + festival.year}
                      </p>
                    )}
                    <p className="text-base">{festival.locationText}</p>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
        {!isArtistInDb && (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="w-full p-2 sm:p-4" />
            <p className="text-base">{t('artist_page.no_festivals')}</p>
            <div className="w-full p-2 sm:p-4" />
          </div>
        )}
      </div>
    </>
  );
});
