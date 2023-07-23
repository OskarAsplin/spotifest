import { useNavigate } from '@tanstack/router';
import { Artist } from '../api/types';
import ArtistBubble from '../components/molecules/ArtistBubble/ArtistBubble';
import { getArtistParam } from '../utils/routeUtils';

interface ArtistBubbleContainerProps {
  artist: Artist;
}

const ArtistBubbleContainer = ({ artist }: ArtistBubbleContainerProps) => {
  const navigate = useNavigate();

  const onClick = () =>
    navigate({
      to: '/artist/$artistId',
      params: { artistId: getArtistParam(artist.name, artist.spotifyId) },
    });

  return <ArtistBubble artist={artist} onClick={onClick} />;
};

export default ArtistBubbleContainer;
