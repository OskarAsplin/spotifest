import { PaletteMode } from '@mui/material';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CenteredLoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';
import AppBarContainer from '../containers/AppBarContainer';

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
