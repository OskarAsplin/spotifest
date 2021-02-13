import { configureStore, getDefaultMiddleware, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers, AnyAction, Reducer } from "redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authorizationReducer, { setLoggedOff } from './reducers/authorizationSlice';
import displayReducer from './reducers/displaySlice';
import festivalMatchingReducer from './reducers/festivalMatchingSlice';
import spotifyAccountReducer from './reducers/spotifyAccountSlice';

const appReducer = combineReducers({
    display: displayReducer,
    authorization: authorizationReducer,
    spotifyAccount: spotifyAccountReducer,
    festivalMatching: festivalMatchingReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    if (action.type === setLoggedOff.type) {
        state = {} as RootState;
    }
    return appReducer(state, action)
}

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
    }),
    devTools: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? true : false,
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
