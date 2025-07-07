import { withFallback } from '@src/api/api';
import { CenteredLoadingSpinner } from '@src/components/atoms/LoadingSpinner/LoadingSpinner';
import { ScrollToTopButton } from '@src/components/atoms/ScrollToTopButton/ScrollToTopButton';
import { FestivalMatchSettingsContainer } from '@src/containers/FestivalMatchSettingsContainer';
import { FestivalMatchesContainer } from '@src/containers/FestivalMatchesContainer';
import { SocialMediaButtonsContainer } from '@src/containers/SocialMediaButtonsContainer';
import { ErrorFallback } from '@src/layouts/ErrorFallback';

const SuspenseFallback = () => <CenteredLoadingSpinner />;

export const MainPage = withFallback(
  SuspenseFallback,
  ErrorFallback,
)(() => (
  <div className="flex w-full flex-col items-center justify-center px-2 sm:px-4">
    <FestivalMatchSettingsContainer />
    <SocialMediaButtonsContainer />
    <FestivalMatchesContainer />
    <ScrollToTopButton />
  </div>
));
