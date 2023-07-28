import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { AnyAction, combineReducers, Reducer } from 'redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import matchingReducer from './reducers/matchingSlice';

const appReducer = combineReducers({
  matching: matchingReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) =>
  appReducer(state, action);

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  devTools: import.meta.env.PROD ? false : true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof appReducer>;
