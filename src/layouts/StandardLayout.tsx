import { Outlet } from 'react-router-dom';
import AppBarView from '../components/AppBarView';
import { PaletteMode } from '@mui/material';

interface Props {
  themeMode: PaletteMode;
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

export const StandardLayout = ({ themeMode, setThemeMode }: Props) => {
  return (
    <>
      <AppBarView themeMode={themeMode} setThemeMode={setThemeMode} />
      <div className="appBarSpace" />
      <Outlet />
    </>
  );
};
