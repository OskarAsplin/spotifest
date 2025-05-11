import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

const noConnectionMessage = 'NetworkError when attempting to fetch resource.';

interface ErrorFallbackProps extends Partial<FallbackProps> {
  fallbackText?: string;
}

export const ErrorFallback = ({ fallbackText, error }: ErrorFallbackProps) => {
  const { t } = useTranslation();
  const errorMessage =
    error?.message && error.message !== noConnectionMessage
      ? error.message
      : t('error.generic_error');
  const displayText = fallbackText ?? errorMessage;
  return (
    <StyledCenteredDiv>
      <VerticalSpaceDiv />
      <VerticalSpaceDiv />
      <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
        {displayText}
      </Typography>
    </StyledCenteredDiv>
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
