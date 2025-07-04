import { Divider, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useApiSuspenseQuery } from '@src/api/api';
import { getArtistRelatedArtists } from '@src/api/spotifyApi';
import {
  ArtistBubble,
  StyledAvatarContainerDiv,
} from '@src/components/molecules/ArtistBubble/ArtistBubble';
import { ArtistBox } from '@src/layouts/StyledLayoutComponents';
import { getMaxArtistsInWidth } from '@src/utils/displayUtils';

interface RelatedArtistsProps {
  spotifyId: string;
}

export const RelatedArtistsContainer = ({ spotifyId }: RelatedArtistsProps) => {
  const { t } = useTranslation();

  const { data: relatedArtists } = useApiSuspenseQuery(
    getArtistRelatedArtists,
    { params: { spotifyId } },
  );

  const bigScreen = useMediaQuery('(min-width:690px)');
  const smallScreen = useMediaQuery('(max-width:439px)');
  const maxArtistsInWidth = getMaxArtistsInWidth(bigScreen, smallScreen, 6);
  const fillRelatedArtistsWidth =
    maxArtistsInWidth - (relatedArtists.length % maxArtistsInWidth);

  if (relatedArtists.length === 0) return null;

  return (
    <>
      <Divider sx={{ width: '100%' }}>
        <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
          {t('artist_page.related_artists')}
        </Typography>
      </Divider>
      <ArtistBox>
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
