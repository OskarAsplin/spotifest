import { useTranslation } from 'react-i18next';
import { HtmlTooltip } from '@src/components/atoms/HtmlTooltip/HtmlTooltip';
import { MatchingCircle } from '@src/components/atoms/MatchingCircle/MatchingCircle';

interface MatchingTooltipProps {
  total: number;
  artists: number;
  genres: number;
}

export const MatchingCircleWithTooltip = ({
  total,
  artists,
  genres,
}: MatchingTooltipProps) => {
  const { t } = useTranslation();

  return (
    <HtmlTooltip
      title={
        <div className="space-y-1 text-xs sm:text-sm">
          <div>{`${t('common.genres')}: ${genres}%`}</div>
          <div>{`${t('common.artists')}: ${artists}%`}</div>
          <div>{`${t('common.total')}: ${total}%`}</div>
        </div>
      }
    >
      <MatchingCircle matchingPercent={total} />
    </HtmlTooltip>
  );
};
