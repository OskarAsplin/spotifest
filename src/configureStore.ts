import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { routerMiddleware } from 'connected-react-router'
import reducers from './rootReducer'
import thunkMiddleware from 'redux-thunk'

export const history = createBrowserHistory({
	basename: window.location.pathname
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
