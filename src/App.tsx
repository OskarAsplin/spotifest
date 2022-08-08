import { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './App.scss';
import { store, persistor } from './redux/store';
import AboutPage from './pages/AboutPage';
import ArtistPage from './pages/ArtistPage';
import FestivalPage from './pages/FestivalPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import PageNotFound from './pages/PageNotFound';
import { StandardLayout } from './layouts/StandardLayout';
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from '@mui/material/styles';
import { getMainTheme } from './layouts/StandardLayout.styles';
import { PaletteMode, CssBaseline } from '@mui/material';

const App = () => {
  const [mode, setMode] = useState<PaletteMode>('dark');
  const theme = useMemo(() => createTheme(getMainTheme(mode)), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<StandardLayout setThemeMode={setMode} />}>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/artist/:artistId" element={<ArtistPage />} />
                  <Route
                    path="/festival/:festivalId"
                    element={<FestivalPage />}
                  />
                  <Route path="/about" element={<AboutPage />} />
                </Route>
                <Route element={<PageNotFound />} />
              </Routes>
            </Router>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
