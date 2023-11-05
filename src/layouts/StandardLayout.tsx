import { Suspense } from 'react';
import { Outlet } from '@tanstack/react-router';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import AppBarContainer from '../containers/AppBarContainer';

export const StandardLayout = () => {
  return (
    <>
      <AppBarContainer />
      <Suspense fallback={<CenteredLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </>
  );
};
