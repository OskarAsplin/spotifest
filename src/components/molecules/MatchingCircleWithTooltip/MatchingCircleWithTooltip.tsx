import { Typography, useMediaQuery } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import HtmlTooltip from '../../atoms/HtmlTooltip/HtmlTooltip';
import MatchingCircle from '../../atoms/MatchingCircle/MatchingCircle';

interface MatchingTooltipProps {
  total: number;
  artists: number;
  genres: number;
}

const MatchingCircleWithTooltip = ({
  total,
  artists,
  genres,
}: MatchingTooltipProps) => {
  const { t } = useTranslation();
  const bigScreen = useMediaQuery('(min-width:690px)');

  const typographyVariant = bigScreen ? 'subtitle2' : 'body2';

  return (
    <HtmlTooltip
      placement="left-start"
      leaveTouchDelay={3000}
      title={
        <Fragment>
          <Typography color="inherit" variant={typographyVariant}>
            {`${t('common.genres')}: ${genres}%`}
          </Typography>
          <Typography color="inherit" variant={typographyVariant}>
            {`${t('common.artists')}: ${artists}%`}
          </Typography>
          <Typography color="inherit" variant={typographyVariant}>
            {`${t('common.total')}: ${total}%`}
          </Typography>
        </Fragment>
      }
    >
      <MatchingCircle matchingPercent={total} />
    </HtmlTooltip>
  );
};

export default MatchingCircleWithTooltip;
