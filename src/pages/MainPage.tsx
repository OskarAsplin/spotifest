import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import { selectLoggedIn } from '../redux/reducers/authorizationSlice';
import '../styles/base.scss';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import FestivalMatchSettingsContainer from '../containers/FestivalMatchSettingsContainer';
import { withFallback } from '../utils/api/api';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import FallbackPage from './FallbackPage';
import SocialMediaButtonsContainer from '../containers/SocialMediaButtonsContainer';

const SuspenseFallback = () => <CenteredLoadingSpinner />;
const ErrorFallback = () => (
  <FallbackPage fallbackText="There seems to be some issue with connecting to our database. Try refreshing the page." />
);

const MainPage = withFallback(
  SuspenseFallback,
  ErrorFallback
)(() => {
  const loggedIn = useSelector(selectLoggedIn);

  if (!loggedIn) return <Navigate to="/login" />;

  return (
    <StyledRootDiv>
      <Box
        sx={{
          width: '100%',
          '@media (min-width: 800px)': { py: 2 },
          '@media (max-width: 799px)': { py: 1 },
        }}
      />
      <FestivalMatchSettingsContainer />
      <SocialMediaButtonsContainer />
      <FestivalMatchesContainer />
    </StyledRootDiv>
  );
});

export default MainPage;
