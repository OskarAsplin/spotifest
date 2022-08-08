import { Outlet } from 'react-router-dom';
import AppBarView from '../components/AppBarView';
import { PaletteMode } from '@mui/material';

interface Props {
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

export const StandardLayout = ({ setThemeMode }: Props) => {
  return (
    <>
      <AppBarView setThemeMode={setThemeMode} />
      <div className="appBarSpace" />
      <Outlet />
    </>
  );
};
