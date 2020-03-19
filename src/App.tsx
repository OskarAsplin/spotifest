import React, {useState} from 'react';
import './App.css';

import {ConnectedRouter} from "connected-react-router";
import configureStore, {history} from "./configureStore";
import {Provider} from "react-redux";
import {Route, Switch} from "react-router";
//import {IntlProvider} from "react-intl";
//import {tekster} from "./tekster/tekster";
//import './App.less';
//import UserGuide from "./pages/UserGuide";
//import NotFound from "./components/notFound";
//import Example from "./pages/Example";
import V1 from "./pages/V1";
import LoginScreen from "./pages/LoginScreen";



const store = configureStore();

const App: React.FC = () => {

  return (
    <Provider store={store}>
      <div className="informasjon-side">
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" component={V1}/>
            <Route exact path="/login" component={LoginScreen}/>
          </Switch>
        </ConnectedRouter>
      </div>
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