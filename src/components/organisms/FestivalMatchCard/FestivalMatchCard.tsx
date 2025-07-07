import { Artist, FestivalMatch } from '@src/api/types';
import { ExpandButton } from '@src/components/atoms/ExpandButton/ExpandButton';
import {
  ArtistBubble,
  StyledAvatarContainerDiv,
} from '@src/components/molecules/ArtistBubble/ArtistBubble';
import { MatchingCircleWithTooltip } from '@src/components/molecules/MatchingCircleWithTooltip/MatchingCircleWithTooltip';
import { Button } from '@src/components/ui/button';
import { Card, CardContent } from '@src/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@src/components/ui/collapsible';
import { Separator } from '@src/components/ui/separator';
import { useMediaQuery } from '@src/hooks/useMediaQuery';
import { cn } from '@src/lib/utils';
import { getCancelledDateString } from '@src/utils/dateUtils';
import {
  displayedLocationName,
  getMaxArtistsInWidth,
  useMeasure,
} from '@src/utils/displayUtils';
import { Link } from '@tanstack/react-router';
import { isEqual } from 'lodash-es';
import { RefObject, memo, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';

export interface FestivalMatchCardProps {
  festival: FestivalMatch;
  popularArtists: Artist[];
  matchingArtists?: Artist[];
  showMatching?: boolean;
}

export const FestivalMatchCard = memo(
  ({
    festival,
    showMatching,
    popularArtists,
    matchingArtists = [],
  }: FestivalMatchCardProps) => {
    const {
      name,
      locationText,
      country,
      date,
      year,
      cancelled,
      matching_percent_artists,
      matching_percent_genres,
      matching_percent_combined,
      top_genres,
    } = festival;
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const bigScreen = useMediaQuery('(min-width:640px)');
    const [ref, { width }] = useMeasure();
    const maxArtistsInWidth = getMaxArtistsInWidth(width, bigScreen);
    const fillMatchingArtistWidth =
      maxArtistsInWidth - (matchingArtists.length % maxArtistsInWidth);
    const fillPopularArtistWidth =
      maxArtistsInWidth - (popularArtists.length % maxArtistsInWidth);

    const noLineupRegistered = popularArtists.length === 0;
    const hasTwoRowsOfPopularArtists =
      popularArtists.length > maxArtistsInWidth;

    return (
      <Card className="mb-4 w-full pt-2 pb-0 shadow-lg" key={name}>
        <CardContent className="px-2 sm:px-4">
          {showMatching && <div className="pb-2" />}
          <div className="px-4">
            <div className="flex w-full flex-row justify-between">
              <div
                className={cn(
                  showMatching ? '' : 'flex w-full flex-col items-center',
                )}
              >
                <Link
                  to="/festival/$festivalId"
                  params={{ festivalId: encodeURIComponent(festival.name) }}
                  className="text-inherit"
                >
                  <Button
                    variant="outline"
                    className={
                      'border-primary hover:bg-primary/5 mb-3 h-auto min-h-0 border-dotted px-2 text-left whitespace-normal'
                    }
                  >
                    <h2
                      className={cn(
                        'text-center font-bold break-words',
                        'text-xl sm:text-3xl',
                      )}
                    >
                      {name}
                    </h2>
                  </Button>
                </Link>
                {cancelled ? (
                  <p className="text-destructive text-sm">
                    {getCancelledDateString(date, year)}
                  </p>
                ) : (
                  <p className="text-sm">{date + ', ' + year}</p>
                )}
                <p className="text-sm">
                  {displayedLocationName(locationText)}
                  <ReactCountryFlag
                    countryCode={country}
                    svg
                    style={{ marginLeft: '8px' }}
                  />
                </p>
              </div>
              {showMatching && (
                <MatchingCircleWithTooltip
                  total={Math.ceil(matching_percent_combined)}
                  artists={Math.ceil(matching_percent_artists)}
                  genres={Math.ceil(matching_percent_genres)}
                />
              )}
            </div>
            <p
              className={cn(
                'overflow-hidden text-sm text-ellipsis whitespace-nowrap',
                showMatching ? '' : 'text-center',
              )}
            >
              {`${t('common.genres')}: ${top_genres}`}
            </p>
            {showMatching && !noLineupRegistered && (
              <p
                className={cn(
                  'mt-4 text-base font-bold',
                  matchingArtists.length > 0
                    ? 'text-primary mb-2'
                    : 'text-muted-foreground',
                )}
              >
                {matchingArtists.length > 0
                  ? t('matching.card.matching_artists')
                  : t('matching.card.no_matching_artists')}
              </p>
            )}
          </div>
          <ArtistBox ref={ref}>
            {showMatching &&
              !noLineupRegistered &&
              matchingArtists.map((artist) => (
                <ArtistBubble
                  key={`avatar_match_artist_${name}_${year}_${artist.name}`}
                  artist={artist}
                />
              ))}
            {showMatching &&
              !noLineupRegistered &&
              matchingArtists.length > 0 &&
              Array.from({ length: fillMatchingArtistWidth }, (_, i) => (
                <StyledAvatarContainerDiv key={i} />
              ))}
          </ArtistBox>
          {noLineupRegistered ? (
            <CardContent className="px-2 sm:px-4">
              <p className="text-muted-foreground py-4 text-base font-bold">
                {t('common.no_lineup')}
              </p>
            </CardContent>
          ) : (
            <>
              <div className="mt-4 mb-2 flex w-full items-center gap-4">
                <Separator className="mx-2 flex-1" />
                {t('matching.card.popular_artists')}
                <Separator className="mx-2 flex-1" />
              </div>
              <ArtistBox
                className={
                  !hasTwoRowsOfPopularArtists ? 'mb-2 sm:mb-4' : undefined
                }
              >
                {popularArtists.length > 0 &&
                  popularArtists
                    .slice(0, maxArtistsInWidth)
                    .map((artist) => (
                      <ArtistBubble
                        key={`avatar_pop_artist_${name}_${year}_${artist.name}`}
                        artist={artist}
                      />
                    ))}
                {popularArtists.length > 0 &&
                  Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                    <StyledAvatarContainerDiv key={i} />
                  ))}
              </ArtistBox>
              <Collapsible open={expanded} onOpenChange={setExpanded}>
                <CollapsibleContent>
                  <ArtistBox>
                    {popularArtists.length > 0 &&
                      popularArtists
                        .slice(
                          maxArtistsInWidth,
                          maxArtistsInWidth > 4
                            ? maxArtistsInWidth * 2
                            : maxArtistsInWidth * 3,
                        )
                        .map((artist) => (
                          <ArtistBubble
                            key={`avatar_pop_artist_${name}_${year}_${artist.name}`}
                            artist={artist}
                          />
                        ))}
                    {popularArtists.length > 0 &&
                      Array.from({ length: fillPopularArtistWidth }, (_, i) => (
                        <StyledAvatarContainerDiv key={i} />
                      ))}
                  </ArtistBox>
                </CollapsibleContent>
                {hasTwoRowsOfPopularArtists && (
                  <CollapsibleTrigger asChild>
                    <div className="flex justify-center">
                      <ExpandButton expanded={expanded} />
                    </div>
                  </CollapsibleTrigger>
                )}
              </Collapsible>
            </>
          )}
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);

export const ArtistBox = ({
  ref,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    className={cn('flex w-full flex-row flex-wrap justify-between', className)}
    {...props}
  >
    {children}
  </div>
);
