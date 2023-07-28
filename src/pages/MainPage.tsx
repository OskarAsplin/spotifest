import { Box } from '@mui/material';
import { Navigate } from '@tanstack/router';
import { withFallback } from '../api/api';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import FestivalMatchSettingsContainer from '../containers/FestivalMatchSettingsContainer';
import SocialMediaButtonsContainer from '../containers/SocialMediaButtonsContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import '../styles/base.scss';
import { useAuthStore } from '../zustand/authStore';

const SuspenseFallback = () => <CenteredLoadingSpinner />;

const MainPage = withFallback(
  SuspenseFallback,
  ErrorFallback,
)(() => {
  const loggedIn = useAuthStore((state) => state.loggedIn);

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
