import { Outlet } from 'react-router-dom';
import AppBarView from '../components/AppBarView';
import { PaletteMode } from '@mui/material';
import { CenteredLoadingSpinner } from '../components/LoadingSpinner';

interface Props {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

export const StandardLayout = ({ setThemeMode }: Props) => {
  return (
    <>
      <AppBarView setThemeMode={setThemeMode} />
      <div className="appBarSpace" />
      <CenteredLoadingSpinner />
      <Outlet />
    </>
  );
};
