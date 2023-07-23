import { CssBaseline } from '@mui/material';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ApiProvider, { injectStore } from './api/ApiProvider';
import './App.scss';
import { persistor, store } from './redux/store';
import { getMainTheme } from './theme/theme.styles';
import { Routes } from './Routes';

injectStore(store);

const App = () => {
  // const [mode, setMode] = useState<PaletteMode>('dark');
  const theme = useMemo(() => createTheme(getMainTheme('dark')), ['dark']);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ApiProvider>
              <Routes />
            </ApiProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
