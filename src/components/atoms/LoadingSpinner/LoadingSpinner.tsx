import { Fragment } from 'react';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const CIRCLE_RADIUS = 20;

export const LoadingSpinner = () => (
  <Fragment>
    <svg width={0} height={0}>
      <defs>
        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e01cd5" />
          <stop offset="100%" stopColor="#1CB5E0" />
        </linearGradient>
      </defs>
    </svg>
    <CircularProgress
      size={CIRCLE_RADIUS * 2}
      sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
    />
  </Fragment>
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
