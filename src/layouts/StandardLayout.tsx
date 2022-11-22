import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PaletteMode } from '@mui/material';
import AppBarContainer from '../containers/AppBarContainer';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';

interface Props {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

export const StandardLayout = ({ setThemeMode }: Props) => {
  return (
    <>
      <AppBarContainer setThemeMode={setThemeMode} />
      <Suspense fallback={<CenteredLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </>
  );
};
