import { Music } from 'lucide-react';
import { Avatar, AvatarImage } from '@src/components/ui/avatar';
import { Button } from '@src/components/ui/button';
import { Skeleton } from '@src/components/ui/skeleton';
import { cn } from '@src/lib/utils';
import { Artist } from '@src/api/types';
import { Link } from '@tanstack/react-router';
import { getArtistParam } from '@src/utils/routeUtils';

interface ArtistBubbleProps {
  artist: Artist;
}

export const ArtistBubble = ({ artist }: ArtistBubbleProps) => (
  <StyledAvatarContainerDiv>
    <Link
      to="/artist/$artistId"
      params={{ artistId: getArtistParam(artist.name, artist.spotifyId) }}
      className="rounded-full"
      disabled={!artist.spotifyId}
    >
      <Button
        variant="ghost"
        className="h-[75px] w-[75px] rounded-full p-0 text-center max-sm:p-1.5 sm:h-[104px] sm:w-[104px] sm:p-3"
        disabled={!artist.spotifyId}
      >
        {artist.iconPicture ? (
          <Avatar
            className={cn(
              'h-15 w-15 sm:h-20 sm:w-20',
              artist.spotifyId && 'shadow-md',
            )}
          >
            <AvatarImage src={artist.iconPicture} alt={artist.name} />
          </Avatar>
        ) : (
          <div
            className={cn(
              'bg-blue-gray-300 dark:bg-accent flex h-15 w-15 items-center justify-center rounded-full sm:h-20 sm:w-20',
              artist.spotifyId && 'shadow-md',
            )}
          >
            <Music className="h-6 w-6" />
          </div>
        )}
      </Button>
    </Link>
    <span className="text-xs">{artist.name}</span>
  </StyledAvatarContainerDiv>
);

export const ArtistBubbleSkeleton = () => (
  <StyledAvatarContainerDiv>
    <Button
      variant="ghost"
      className="h-[75px] w-[75px] text-center max-sm:p-1.5 sm:h-[104px] sm:w-[104px] sm:p-3"
      disabled
    >
      <Skeleton className="h-15 w-15 rounded-full sm:h-20 sm:w-20" />
    </Button>
    <Skeleton className="h-4 w-15" />
  </StyledAvatarContainerDiv>
);

export const StyledAvatarContainerDiv = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex w-[75px] flex-col items-center text-center max-sm:mb-1.5 sm:w-[100px]',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
