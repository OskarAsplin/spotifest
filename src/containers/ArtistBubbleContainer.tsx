import { useNavigate } from 'react-router-dom';
import { Artist } from '../redux/types';
import { getArtistPath } from '../utils/routeUtils';
import ArtistBubble from '../components/molecules/ArtistBubble/ArtistBubble';

interface ArtistBubbleContainerProps {
  artist: Artist;
}

const ArtistBubbleContainer = ({ artist }: ArtistBubbleContainerProps) => {
  const navigate = useNavigate();

  const onClick = () => navigate(getArtistPath(artist.name, artist.spotifyId));

  return <ArtistBubble artist={artist} onClick={onClick} />;
};

export default ArtistBubbleContainer;
