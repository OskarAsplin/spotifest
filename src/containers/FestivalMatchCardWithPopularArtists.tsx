import { useApiSuspenseQuery, withFallback } from '../api/api';
import { postDjangoPopularArtistsInLineups } from '../api/djangoApi';
import FestivalMatchCard, {
  FestivalMatchCardProps,
} from '../components/organisms/FestivalMatchCard/FestivalMatchCard';
import FestivalMatchCardSkeleton from '../components/organisms/FestivalMatchCard/FestivalMatchCard.skeleton';
import ErrorFallback from '../layouts/ErrorFallback';

const SuspenseFallback = ({
  festival,
}: FestivalMatchCardWithPopularArtistsProps) => (
  <FestivalMatchCardSkeleton key={festival.name} />
);

type FestivalMatchCardWithPopularArtistsProps = Omit<
  FestivalMatchCardProps,
  'popularArtists'
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
      <FestivalMatchCard
        {...restProps}
        festival={festival}
        popularArtists={popularArtists}
      />
    );
  });
