import { useNavigate } from 'react-router-dom';
import FestivalMatchCard, {
  FestivalMatchCardProps,
} from '../components/organisms/FestivalMatchCard/FestivalMatchCard';
import { getArtistPath } from '../utils/routeUtils';

type Props = Omit<
  FestivalMatchCardProps,
  'onClickTitle' | 'onClickArtistBubble'
>;

const FestivalMatchCardContainer = ({ festival, ...restProps }: Props) => {
  const navigate = useNavigate();

  const navigateToFestival = () =>
    navigate(`/festival/${encodeURIComponent(festival.name)}`);

  const navigateToArtist = (artistName: string, spotifyId?: string) =>
    navigate(getArtistPath(artistName, spotifyId));

  return (
    <FestivalMatchCard
      festival={festival}
      onClickTitle={navigateToFestival}
      onClickArtistBubble={navigateToArtist}
      {...restProps}
    />
  );
};

export default FestivalMatchCardContainer;
