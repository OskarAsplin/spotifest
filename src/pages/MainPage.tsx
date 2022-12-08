import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { withFallback } from '../api/api';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import FestivalMatchSettingsContainer from '../containers/FestivalMatchSettingsContainer';
import SocialMediaButtonsContainer from '../containers/SocialMediaButtonsContainer';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import { selectLoggedIn } from '../redux/reducers/authorizationSlice';
import '../styles/base.scss';
import { DefaultErrorFallback } from './FallbackPage';

const SuspenseFallback = () => <CenteredLoadingSpinner />;

const MainPage = withFallback(
  SuspenseFallback,
  DefaultErrorFallback
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
