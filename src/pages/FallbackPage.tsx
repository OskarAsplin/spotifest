import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import TopLeftBackButtonContainer from '../containers/TopLeftBackButtonContainer';

interface FallbackPageProps {
  fallbackText: string;
}

const FallbackPage = ({ fallbackText }: FallbackPageProps) => {
  const pcScreen = useMediaQuery('(min-width:1300px)');
  return (
    <>
      {pcScreen && <TopLeftBackButtonContainer />}
      <StyledCenteredDiv>
        <VerticalSpaceDiv />
        <VerticalSpaceDiv />
        <Typography variant="subtitle1">{fallbackText}</Typography>
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
