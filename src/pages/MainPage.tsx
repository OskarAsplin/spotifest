import { Box } from '@mui/material';
import { withFallback } from '@src/api/api';
import { CenteredLoadingSpinner } from '@src/components/atoms/LoadingSpinner/LoadingSpinner';
import { ScrollToTopButton } from '@src/components/atoms/ScrollToTopButton/ScrollToTopButton';
import { FestivalMatchSettingsContainer } from '@src/containers/FestivalMatchSettingsContainer';
import { FestivalMatchesContainer } from '@src/containers/FestivalMatchesContainer';
import { SocialMediaButtonsContainer } from '@src/containers/SocialMediaButtonsContainer';
import { ErrorFallback } from '@src/layouts/ErrorFallback';
import { StyledRootDiv } from '@src/layouts/StyledLayoutComponents';

const SuspenseFallback = () => <CenteredLoadingSpinner />;

export const MainPage = withFallback(
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
