import { Outlet } from 'react-router-dom';
import AppBarView from '../components/AppBarView';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { PaletteMode, CssBaseline } from '@mui/material';
import { selectThememode } from '../redux/reducers/displaySlice';
import { lightBluePinkThemeOptions } from './StandardLayout.styles';

export const StandardLayout = () => {
  const thememode: PaletteMode = useSelector(selectThememode);

  const muiTheme = createTheme({
    typography: {
      fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
    },
    palette: { ...lightBluePinkThemeOptions, mode: thememode },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppBarView />
      <div className="appBarSpace" />
      <Outlet />
    </ThemeProvider>
  );
};
