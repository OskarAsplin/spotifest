import { useApiSuspenseQuery } from '@src/api/api';
import { getArtistRelatedArtists } from '@src/api/spotifyApi';
import {
  ArtistBubble,
  StyledAvatarContainerDiv,
} from '@src/components/molecules/ArtistBubble/ArtistBubble';
import { ArtistBox } from '@src/components/organisms/FestivalMatchCard/FestivalMatchCard';
import { Separator } from '@src/components/ui/separator';
import { useMediaQuery } from '@src/hooks/useMediaQuery';
import { getMaxArtistsInWidth, useMeasure } from '@src/utils/displayUtils';
import { useTranslation } from 'react-i18next';

interface RelatedArtistsProps {
  spotifyId: string;
}

export const RelatedArtistsContainer = ({ spotifyId }: RelatedArtistsProps) => {
  const { t } = useTranslation();

  const { data: relatedArtists } = useApiSuspenseQuery(
    getArtistRelatedArtists,
    { params: { spotifyId } },
  );

  const bigScreen = useMediaQuery('(min-width:640px)');
  const [ref, { width }] = useMeasure();
  const maxArtistsInWidth = getMaxArtistsInWidth(width, bigScreen);
  const fillRelatedArtistsWidth =
    maxArtistsInWidth - (relatedArtists.length % maxArtistsInWidth);

  if (relatedArtists.length === 0) return null;

  return (
    <>
      <div className="flex w-full items-center gap-4">
        <Separator className="flex-1" />
        <h3 className="text-primary text-base font-bold">
          {t('artist_page.related_artists')}
        </h3>
        <Separator className="flex-1" />
      </div>
      <ArtistBox ref={ref}>
        {relatedArtists.slice(0, maxArtistsInWidth).map((artist) => (
          <ArtistBubble
            key={`avatar_rel_artist_${artist.name}`}
            artist={artist}
          />
        ))}
        {relatedArtists.length > 0 &&
          Array.from({ length: fillRelatedArtistsWidth }, (_, i) => (
            <StyledAvatarContainerDiv key={i} />
          ))}
      </ArtistBox>
    </>
  );
};
