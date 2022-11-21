import { CircularProgress, CircularProgressProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CIRCLE_RADIUS = 50;

export const LoadingSpinner = ({ sx, ...restProps }: CircularProgressProps) => (
  <CircularProgress
    size={CIRCLE_RADIUS * 2}
    thickness={3}
    sx={{ color: ({ palette }) => palette.tertiary?.[palette.mode], ...sx }}
    {...restProps}
  />
);

export const CenteredLoadingSpinner = () => (
  <StyledDiv>
    <LoadingSpinner />
  </StyledDiv>
);

const StyledDiv = styled('div')(() => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  marginTop: `-${CIRCLE_RADIUS}px`,
  marginLeft: `-${CIRCLE_RADIUS}px`,
}));
