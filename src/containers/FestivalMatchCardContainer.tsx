import { useNavigate } from '@tanstack/router';
import FestivalMatchCard, {
  FestivalMatchCardProps,
} from '../components/organisms/FestivalMatchCard/FestivalMatchCard';
import { getArtistParam } from '../utils/routeUtils';
import { postDjangoPopularArtistsInLineups } from '../api/djangoApi';
import { useApiSuspenseQuery, withFallback } from '../api/api';
import ErrorFallback from '../layouts/ErrorFallback';
import FestivalMatchCardSkeleton from '../components/organisms/FestivalMatchCard/FestivalMatchCard.skeleton';

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

const SuspenseFallback = ({
  festival,
}: FestivalMatchCardWithPopularArtistsProps) => (
  <FestivalMatchCardSkeleton key={festival.name} />
);

type FestivalMatchCardWithPopularArtistsProps = Omit<
  FestivalMatchCardProps,
  'onClickTitle' | 'onClickArtistBubble' | 'popularArtists'
> & { pageLineups: string[] };

export const FestivalMatchCardWithPopularArtists =
  withFallback<FestivalMatchCardWithPopularArtistsProps>(
    SuspenseFallback,
    ErrorFallback,
  )(({ pageLineups, festival, ...restProps }) => {
    const { data: popularArtistsDict } = useApiSuspenseQuery<
      typeof postDjangoPopularArtistsInLineups
    >(postDjangoPopularArtistsInLineups, {
      params: { lineups: pageLineups },
    });

    const popularArtists = popularArtistsDict[festival.lineup_id];

    return (
      <FestivalMatchCardContainer
        {...restProps}
        festival={festival}
        popularArtists={popularArtists}
      />
    );
  });

export default FestivalMatchCardContainer;
