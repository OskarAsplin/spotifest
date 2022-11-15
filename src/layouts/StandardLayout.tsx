import { Outlet } from 'react-router-dom';
import AppBarView from '../containers/AppBarView';
import { PaletteMode } from '@mui/material';
import { CenteredLoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';
import { Suspense } from 'react';

interface Props {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

export const StandardLayout = ({ setThemeMode }: Props) => {
  return (
    <>
      <AppBarView setThemeMode={setThemeMode} />
      <CenteredLoadingSpinner />
      <Suspense fallback={<CenteredLoadingSpinner show />}>
        <Outlet />
      </Suspense>
    </>
  );
};
