import { CircularProgress, CircularProgressProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectLoaderOn } from '../redux/reducers/displaySlice';
import '../styles/base.scss';
import { styled } from '@mui/material/styles';

export const LoadingSpinner = (props: CircularProgressProps) => {
  return (
    <CircularProgress
      size={100}
      thickness={3}
      sx={{ color: ({ palette }) => palette.tertiary?.[palette.mode] }}
      {...props}
    />
  );
};

export const CenteredLoadingSpinner = () => {
  const loaderOn: boolean = useSelector(selectLoaderOn);
  return (
    <StyledDiv hidden={!loaderOn}>
      <LoadingSpinner />
    </StyledDiv>
  );
};

const StyledDiv = styled('div')(() => {
  return {
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-50px',
  };
});
