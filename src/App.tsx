import React from 'react';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import './App.scss';
import { store, persistor } from "./redux/store";
import AboutPage from "./pages/AboutPage";
import ArtistPage from "./pages/ArtistPage";
import FestivalPage from "./pages/FestivalPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import PageNotFound from "./pages/PageNotFound";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/artist/:artistId" component={ArtistPage} />
            <Route exact path="/festival/:festivalId" component={FestivalPage} />
            <Route exact path="/about" component={AboutPage} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
