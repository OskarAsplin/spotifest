import React from 'react';
import './App.scss';

import configureStore from "./configureStore";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
//import { Route, Switch } from "react-router";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import AboutPage from "./pages/AboutPage";


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
