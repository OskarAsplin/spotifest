import { Box } from '@mui/material';
import { withFallback } from '../api/api';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import ScrollToTopButton from '../components/atoms/ScrollToTopButton/ScrollToTopButton';
import FestivalMatchSettingsContainer from '../containers/FestivalMatchSettingsContainer';
import FestivalMatchesContainer from '../containers/FestivalMatchesContainer';
import SocialMediaButtonsContainer from '../containers/SocialMediaButtonsContainer';
import ErrorFallback from '../layouts/ErrorFallback';
import { StyledRootDiv } from '../layouts/StyledLayoutComponents';
import '../styles/base.scss';

const SuspenseFallback = () => <CenteredLoadingSpinner />;

const MainPage = withFallback(
  SuspenseFallback,
  ErrorFallback,
)(() => (
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
    <ScrollToTopButton />
  </StyledRootDiv>
));

export default MainPage;
