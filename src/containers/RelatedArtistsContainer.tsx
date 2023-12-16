import { Divider, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useApiSuspenseQuery } from '../api/api';
import { getArtistRelatedArtists } from '../api/spotifyApi';
import ArtistBubble, {
  StyledAvatarContainerdiv,
} from '../components/molecules/ArtistBubble/ArtistBubble';
import { ArtistBox } from '../layouts/StyledLayoutComponents';
import '../styles/base.scss';
import { getMaxArtistsInWidth } from '../utils/displayUtils';

interface RelatedArtistsProps {
  spotifyId: string;
}

const RelatedArtistsContainer = ({ spotifyId }: RelatedArtistsProps) => {
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
            <StyledAvatarContainerdiv key={i} />
          ))}
      </ArtistBox>
    </>
  );
};

export default RelatedArtistsContainer;
