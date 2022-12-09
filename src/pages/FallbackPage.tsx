import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import TopLeftBackButtonContainer from '../containers/TopLeftBackButtonContainer';

const noConnectionMessage = 'NetworkError when attempting to fetch resource.';

interface FallbackPageProps extends Partial<FallbackProps> {
  fallbackText?: string;
}

const FallbackPage = ({ fallbackText, error }: FallbackPageProps) => {
  const pcScreen = useMediaQuery('(min-width:1300px)');
  const { t } = useTranslation();
  const errorMessage =
    error?.message && error.message !== noConnectionMessage
      ? error.message
      : t('error.generic_error');
  const displayText = fallbackText ?? errorMessage;
  return (
    <>
      {pcScreen && <TopLeftBackButtonContainer />}
      <StyledCenteredDiv>
        <VerticalSpaceDiv />
        <VerticalSpaceDiv />
        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
          {displayText}
        </Typography>
      </StyledCenteredDiv>
    </>
  );
};

const VerticalSpaceDiv = styled('div')(({ theme: { spacing } }) => ({
  '@media (min-width: 690px)': { padding: spacing(2) },
  '@media (max-width: 689px)': { padding: spacing(1) },
  width: '100%',
}));

const StyledCenteredDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
}));

export default FallbackPage;
