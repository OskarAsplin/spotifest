import React from 'react';
import { Outlet } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import AppBarView from '../components/AppBarView';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { PaletteType } from '@material-ui/core';
import { selectThememode } from '../redux/reducers/displaySlice';
import { lightBluePinkThemeOptions } from './StandardLayout.styles';

export const StandardLayout = () => {
  const thememode: PaletteType = useSelector(selectThememode);

  const muiTheme = createTheme({
    typography: {
      fontFamily: `'Lato', 'Roboto', 'Helvetica', 'Arial', sans- serif`,
    },
    palette: {
      ...lightBluePinkThemeOptions,
      type: thememode,
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppBarView />
      <div className="appBarSpace" />
      <Outlet />
    </MuiThemeProvider>
  );
};
