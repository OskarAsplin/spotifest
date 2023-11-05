import {
  Box,
  Pagination,
  PaginationProps,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useTranslation } from 'react-i18next';
import FestivalMatchCardSkeleton from '../../organisms/FestivalMatchCard/FestivalMatchCard.skeleton';

export const FestivalMatchesSkeleton = () => {
  const mediumOrBigScreen = useMediaQuery('(min-width:400px)');
  const paginationProps: PaginationProps = {
    count: 3,
    page: 1,
    size: mediumOrBigScreen ? 'medium' : 'small',
  };

  return (
    <StyledMatchesRootBox>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          '@media (min-width: 610px)': { my: 1.5 },
          '@media (max-width: 609px)': { flexDirection: 'column', mb: 1 },
        }}
      >
        <StyledNumMatchesTypography variant="subtitle2">
          <Skeleton width={70} />
        </StyledNumMatchesTypography>
        <StyledPaginationBox>
          <Skeleton variant="rounded">
            <Pagination {...paginationProps} />
          </Skeleton>
        </StyledPaginationBox>
      </Box>
      <Stack spacing={3}>
        <FestivalMatchCardSkeleton />
        <FestivalMatchCardSkeleton />
      </Stack>
      <StyledPaginationBox sx={{ mt: 3, mb: 2 }}>
        <Skeleton variant="rounded">
          <Pagination {...paginationProps} />
        </Skeleton>
      </StyledPaginationBox>
    </StyledMatchesRootBox>
  );
};

interface FestivalMatchesProps {
  paginationProps: PaginationProps;
  totalMatches: number;
  children: React.ReactNode;
}

const FestivalMatches = ({
  paginationProps,
  totalMatches,
  children,
}: FestivalMatchesProps) => {
  const mediumOrBigScreen = useMediaQuery('(min-width:400px)');

  return (
    <StyledMatchesRootBox>
      {totalMatches > 0 && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            '@media (min-width: 610px)': { my: 1.5 },
            '@media (max-width: 609px)': { flexDirection: 'column', mb: 1 },
          }}
        >
          <StyledNumMatchesTypography variant="subtitle2">
            {totalMatches + ' matches'}
          </StyledNumMatchesTypography>
          <StyledPaginationBox>
            <Pagination
              {...paginationProps}
              size={mediumOrBigScreen ? 'medium' : 'small'}
            />
          </StyledPaginationBox>
        </Box>
      )}
      <Stack spacing={3}>{children}</Stack>
      {totalMatches > 0 && (
        <StyledPaginationBox sx={{ mt: 3, mb: 2 }}>
          <Pagination {...paginationProps} />
        </StyledPaginationBox>
      )}
      {totalMatches === 0 && <NoMatchResults />}
    </StyledMatchesRootBox>
  );
};

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

export const StyledMatchesRootBox = styled(Box)(({ theme: { spacing } }) => ({
  width: '100%',
  maxWidth: '764px',
  '@media (max-width: 609px)': { marginTop: spacing(1) },
  '@media (min-width: 800px)': { marginTop: spacing(1) },
}));

const StyledPaginationBox = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));

const StyledNumMatchesTypography = styled(Typography)(
  ({ theme: { spacing } }) => ({
    '@media (min-width: 610px)': { position: 'absolute', textAlign: 'center' },
    '@media (max-width: 609px)': { marginBottom: spacing(1) },
  }),
);

export default FestivalMatches;
