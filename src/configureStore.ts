import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import reducers from './rootReducer'
import thunkMiddleware from 'redux-thunk'

/**
 * Resolves basename in a pathname independent way
 */
export function getAbsoluteBasename() {
	// @ts-ignore
	// return erDev() ? "sosialhjelp/fagsystem-mock" : window.location.pathname.replace(/^\/(([^/]+\/)?sosialhjelp\/fagsystem-mock).+$/, "$1")
	return window.location.pathname.replace(/^\/(([^/]+\/)?sosialhjelp\/fagsystem-mock).+$/, "$1")
}

export const history = createBrowserHistory({
	basename: getAbsoluteBasename()
});

export default function configureStore() {
	const w : any = window as any;
	const devtools: any = w.__REDUX_DEVTOOLS_EXTENSION__ ? w.__REDUX_DEVTOOLS_EXTENSION__() : (f:any)=>f;

	const store = createStore(
		reducers(history),
		compose(
			applyMiddleware(
				routerMiddleware(history),
				thunkMiddleware
			),
			devtools
		)
	);
	return store;
};
