import {
  ThemeProvider,
  CircularProgress,
  CircularProgressProps,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectLoaderOn } from '../redux/reducers/displaySlice';
import '../styles/base.scss';
import { indigoOrangePalette } from '../layouts/StandardLayout.styles';
import { styled } from '@mui/material/styles';

export const LoadingSpinner = (props: CircularProgressProps) => {
  const indigoOrangeMuiTheme = createTheme({ palette: indigoOrangePalette });
  return (
    <ThemeProvider theme={indigoOrangeMuiTheme}>
      <CircularProgress
        size={100}
        thickness={3}
        color={'secondary'}
        {...props}
      />
    </ThemeProvider>
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
