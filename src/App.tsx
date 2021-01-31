import React from 'react';
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import './App.scss';
import configureStore from "./configureStore";
import AboutPage from "./pages/AboutPage";
import ArtistPage from "./pages/ArtistPage";
import FestivalPage from "./pages/FestivalPage";
import LoginScreen from "./pages/LoginScreen";
import V1 from "./pages/V1";
import { texts } from "./texts/texts";

const { store, persistor } = configureStore();

const App: React.FC = () => {
  const language = "nb";

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IntlProvider defaultLocale={language} locale={language} messages={texts[language]}>
          <Router>
            <Switch>
              <Route exact path="/" component={V1} />
              <Route exact path="/login" component={LoginScreen} />
              <Route exact path="/artist/:artistId" component={ArtistPage} />
              <Route exact path="/festival/:festivalId" component={FestivalPage} />
              <Route exact path="/about" component={AboutPage} />
            </Switch>
          </Router>
        </IntlProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
