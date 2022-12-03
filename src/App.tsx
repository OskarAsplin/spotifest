import { CssBaseline, PaletteMode } from '@mui/material';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import ApiProvider from './api/ApiProvider';
import './App.scss';
import { StandardLayout } from './layouts/StandardLayout';
import WithSpotifyTokenRoute from './layouts/WithSpotifyTokenRoute';
import AboutPage from './pages/AboutPage';
import ArtistPage from './pages/ArtistPage';
import FestivalPage from './pages/FestivalPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import PageNotFound from './pages/PageNotFound';
import SharedResultsPage from './pages/SharedResultsPage';
import { persistor, store } from './redux/store';
import { getMainTheme } from './theme/theme.styles';

const App = () => {
  const [mode, setMode] = useState<PaletteMode>('dark');
  const theme = useMemo(() => createTheme(getMainTheme(mode)), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ApiProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<WithSpotifyTokenRoute />}>
                    <Route element={<StandardLayout setThemeMode={setMode} />}>
                      <Route path="/" element={<MainPage />} />
                      <Route
                        path="/share/:matchBasis"
                        element={<SharedResultsPage />}
                      />
                      <Route path="/share" element={<SharedResultsPage />} />
                      <Route
                        path="/artist/:artistId"
                        element={<ArtistPage />}
                      />
                      <Route
                        path="/festival/:festivalId"
                        element={<FestivalPage />}
                      />
                      <Route path="/about" element={<AboutPage />} />
                    </Route>
                  </Route>
                  <Route element={<PageNotFound />} />
                </Routes>
              </Router>
            </ApiProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
