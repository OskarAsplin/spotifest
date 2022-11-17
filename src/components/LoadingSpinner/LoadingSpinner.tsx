import { CircularProgress, CircularProgressProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectLoaderOn } from '../../redux/reducers/displaySlice';
import '../../styles/base.scss';
import { styled } from '@mui/material/styles';

export const LoadingSpinner = ({ sx, ...restProps }: CircularProgressProps) => (
  <CircularProgress
    size={100}
    thickness={3}
    sx={{ color: ({ palette }) => palette.tertiary?.[palette.mode], ...sx }}
    {...restProps}
  />
);

export const CenteredLoadingSpinner = ({ show }: { show?: boolean }) => {
  const loaderOn = useSelector(selectLoaderOn);
  return (
    <StyledDiv hidden={!loaderOn && !show}>
      <LoadingSpinner />
    </StyledDiv>
  );
};

const StyledDiv = styled('div')(() => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  marginTop: '-50px',
  marginLeft: '-50px',
}));
