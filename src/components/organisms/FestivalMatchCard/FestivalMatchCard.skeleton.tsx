import {
  ArtistBubbleSkeleton,
  StyledAvatarContainerDiv,
} from '@src/components/molecules/ArtistBubble/ArtistBubble';
import { Card, CardContent } from '@src/components/ui/card';
import { Skeleton } from '@src/components/ui/skeleton';
import { Separator } from '@src/components/ui/separator';
import { ArtistBox } from './FestivalMatchCard';

interface FestivalMatchCardSkeletonProps {
  maxArtistsInWidth: number;
}

export const FestivalMatchCardSkeleton = ({
  maxArtistsInWidth,
}: FestivalMatchCardSkeletonProps) => {
  const mockPopularArtists = Array(7).fill(null);
  const mockMatchingArtists = Array(3).fill(null);

  const fillMatchingArtistWidth =
    maxArtistsInWidth - (mockMatchingArtists.length % maxArtistsInWidth);
  const fillPopularArtistWidth =
    maxArtistsInWidth - (mockPopularArtists.length % maxArtistsInWidth);

  return (
    <Card className="mb-4 w-full pt-1 pb-0 shadow-lg sm:pt-2">
      <CardContent className="px-2 sm:px-4">
        <div className="pb-2" />
        <div className="px-2 sm:px-4">
          <div className="flex w-full flex-row justify-between">
            <div>
              <Skeleton className="border-primary hover:bg-primary/5 mb-3.5 h-11.5 w-40 border-dotted px-2 sm:mb-3 sm:h-14 sm:w-70" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-12.5 w-12.5 rounded-full sm:h-20 sm:w-20" />
          </div>
          <Skeleton className="mt-6 mb-2 h-4 w-32" />
        </div>
        <ArtistBox>
          {mockMatchingArtists.map((_, i) => (
            <ArtistBubbleSkeleton key={`avatar_match_artist_skeleton_${i}`} />
          ))}
          {mockMatchingArtists.length > 0 &&
            Array.from({ length: fillMatchingArtistWidth }, (_, i) => (
              <StyledAvatarContainerDiv key={i} />
            ))}
        </ArtistBox>
        <div className="mt-2 mb-2 flex w-full items-center gap-3 px-2 sm:mt-4">
          <Separator className="flex-1" />
          <Skeleton className="my-1.5 h-4 w-50" />
          <Separator className="flex-1" />
        </div>
        <ArtistBox>
          {mockPopularArtists.slice(0, maxArtistsInWidth).map((_, i) => (
            <ArtistBubbleSkeleton key={`avatar_pop_artist_skeleton_${i}`} />
          ))}
          {Array.from({ length: fillPopularArtistWidth }, (_, i) => (
            <StyledAvatarContainerDiv key={i} />
          ))}
        </ArtistBox>
        <div className="flex w-full justify-center">
          <Skeleton className="mt-1.5 mb-2 h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
};
