import React from 'react';
import './App.css';

import { ConnectedRouter } from "connected-react-router";
import configureStore, { history } from "./configureStore";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { IntlProvider } from "react-intl";
import { texts } from "./texts/texts";
//import './App.less';
//import UserGuide from "./pages/UserGuide";
//import NotFound from "./components/notFound";
//import Example from "./pages/Example";
import V1 from "./pages/V1";
import LoginScreen from "./pages/LoginScreen";
import ArtistPage from "./pages/ArtistPage";
import FestivalPage from "./pages/FestivalPage";


const { store, persistor } = configureStore();

const App: React.FC = () => {
  const language = "nb";

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IntlProvider defaultLocale={language} locale={language} messages={texts[language]}>
          <div className="informasjon-side">
            <ConnectedRouter history={history}>
              <Switch>
                <Route path="/" component={V1} />
                <Route path="/login" component={LoginScreen} />
                <Route path="/artist" component={ArtistPage} />
                <Route path="/festival" component={FestivalPage} />
              </Switch>
            </ConnectedRouter>
          </div>
        </IntlProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;




/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
