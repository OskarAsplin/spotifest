import { Skeleton } from '@src/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { FestivalMatchCardSkeleton } from '@src/components/organisms/FestivalMatchCard/FestivalMatchCard.skeleton';

export const FestivalMatchesSkeleton = () => (
  <div className="mt-2 w-full max-w-3xl">
    <div className="mb-2 flex w-full flex-col items-center">
      <Skeleton className="mb-2 h-5 w-[70px]" />
    </div>
    <FestivalMatchCardSkeleton />
    <FestivalMatchCardSkeleton />
  </div>
);

interface FestivalMatchesProps {
  totalMatches: number;
  children: React.ReactNode;
}

export const FestivalMatches = ({
  totalMatches,
  children,
}: FestivalMatchesProps) => (
  <div className="mt-2 w-full max-w-3xl">
    {totalMatches > 0 && (
      <div className="mb-2 flex w-full flex-col items-center">
        <p className="mb-2 text-sm font-medium">{totalMatches + ' matches'}</p>
      </div>
    )}
    {children}
    {totalMatches === 0 && <NoMatchResults />}
  </div>
);

export const NoMatchResults = () => {
  const { t } = useTranslation();

  return (
    <p className="w-full py-4 text-center text-base">
      {t('matching.no_results')}
    </p>
  );
};
