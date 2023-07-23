import { useNavigate } from '@tanstack/router';
import FestivalMatchCard, {
  FestivalMatchCardProps,
} from '../components/organisms/FestivalMatchCard/FestivalMatchCard';
import { getArtistParam } from '../utils/routeUtils';

type Props = Omit<
  FestivalMatchCardProps,
  'onClickTitle' | 'onClickArtistBubble'
>;

const FestivalMatchCardContainer = ({ festival, ...restProps }: Props) => {
  const navigate = useNavigate();

  const navigateToFestival = () =>
    navigate({
      to: '/festival/$festivalId',
      params: { festivalId: encodeURIComponent(festival.name) },
    });

  const navigateToArtist = (artistName: string, spotifyId?: string) =>
    navigate({
      to: '/artist/$artistId',
      params: { artistId: getArtistParam(artistName, spotifyId) },
    });

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
