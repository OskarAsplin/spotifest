import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { routerMiddleware } from 'connected-react-router'
import reducers from './rootReducer'
import thunkMiddleware from 'redux-thunk'
import { isDev } from "./utils/restUtils";

/**
 * Resolves basename in a pathname independent way
 */
export function getAbsoluteBasename() {
	// @ts-ignore
	return isDev() ? "ontour" : window.location.pathname
}

export const history = createBrowserHistory({
	basename: getAbsoluteBasename()
});

const persistConfig = {
	key: 'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, reducers(history))

export default () => {
	const w: any = window as any;
	const devtools: any = w.__REDUX_DEVTOOLS_EXTENSION__ ? w.__REDUX_DEVTOOLS_EXTENSION__() : (f: any) => f;

	let store = createStore(
		persistedReducer,
		compose(
			applyMiddleware(
				routerMiddleware(history),
				thunkMiddleware
			),
			devtools
		))
	let persistor = persistStore(store)
	return { store, persistor }
}
