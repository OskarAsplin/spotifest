import { Box, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FestivalMatchCardSkeleton from '@src/components/organisms/FestivalMatchCard/FestivalMatchCard.skeleton';

export const FestivalMatchesSkeleton = () => (
  <StyledMatchesRootDiv>
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        mb: 1,
      }}
    >
      <Typography variant="subtitle2" mb={1}>
        <Skeleton width={70} />
      </Typography>
    </Box>
    <FestivalMatchCardSkeleton />
    <FestivalMatchCardSkeleton />
  </StyledMatchesRootDiv>
);

interface FestivalMatchesProps {
  totalMatches: number;
  children: React.ReactNode;
}

const FestivalMatches = ({ totalMatches, children }: FestivalMatchesProps) => (
  <StyledMatchesRootDiv>
    {totalMatches > 0 && (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          flexDirection: 'column',
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" mb={1}>
          {totalMatches + ' matches'}
        </Typography>
      </Box>
    )}
    {children}
    {totalMatches === 0 && <NoMatchResults />}
  </StyledMatchesRootDiv>
);

export const NoMatchResults = () => {
  const { t } = useTranslation();

  return (
    <Typography
      variant="subtitle1"
      sx={{ width: '100%', textAlign: 'center', py: 2 }}
    >
      {t('matching.no_results')}
    </Typography>
  );
};

export const StyledMatchesRootDiv = styled('div')(({ theme: { spacing } }) => ({
  width: '100%',
  maxWidth: '764px',
  marginTop: spacing(1),
}));

export default FestivalMatches;
