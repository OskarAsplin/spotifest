import { Navigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { shareMatchesRoute } from '../Routes';
import ErrorFallback from '../layouts/ErrorFallback';
import '../styles/base.scss';
import { useIsLoggedIn } from '../zustand/authStore';
import { useSharedMatchBasis } from '../zustand/sharedResultsStore';

const SharedResultsReturnPage = () => {
  const loggedIn = useIsLoggedIn();
  const matchBasis = useSharedMatchBasis();
  const { t } = useTranslation();

  if (!loggedIn || !matchBasis)
    return <ErrorFallback fallbackText={t('error.invalid_share_url')} />;

  return <Navigate to={shareMatchesRoute.to} params={{ matchBasis }} />;
};

export default SharedResultsReturnPage;
