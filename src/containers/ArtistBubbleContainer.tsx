import { useNavigate } from 'react-router-dom';
import { Artist } from '../redux/types';
import { getArtistPath } from '../utils/utils';
import ArtistBubble from '../components/ArtistBubble/ArtistBubble';

interface ArtistBubbleContainerProps {
  artist: Artist;
}

const ArtistBubbleContainer = ({ artist }: ArtistBubbleContainerProps) => {
  const navigate = useNavigate();

  const onClick = () => navigate(getArtistPath(artist.name, artist.spotifyId));

  return <ArtistBubble artist={artist} onClick={onClick} />;
};

export default ArtistBubbleContainer;
