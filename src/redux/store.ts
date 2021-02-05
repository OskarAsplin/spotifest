import { configureStore, getDefaultMiddleware, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authorizationReducer from './reducers/authorizationSlice';
import displayReducer from './reducers/displaySlice';
import festivalMatchingReducer from './reducers/festivalMatchingSlice';
import spotifyAccountReducer from './reducers/spotifyAccountSlice';

const rootReducer = combineReducers({
    display: displayReducer,
    authorization: authorizationReducer,
    spotifyAccount: spotifyAccountReducer,
    festivalMatching: festivalMatchingReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
