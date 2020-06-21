import { Action, ActionTypeKeys, Model, FestivalMatch, MatchingMethod, Playlist } from "./types";
import { Reducer } from "redux";


export const initialModel: Model = {
    loaderOn: false,
    loggedIn: true,
    siteInitialized: false,
    isDbOnline: true,

    // Visnings
    thememode: 'dark',

    //Logikk
    accessToken: '',
    tokenExpiryDate: '',
    userInfo: undefined,
    showPlaylistModal: true,
    topArtists: [],
    playlists: [],
    topArtistsLoaded: false,
    playlistsLoaded: false,
    selectedPlaylistArtists: [],
    festivalMatches: [],
    matchingMethod: MatchingMethod.Genre,
    countries: [],
    continents: [],
    matchSettings: {
        matchBasis: '',
        area: { name: 'Europe', isoCode: 'EU' },
        fromDate: (new Date()).toISOString(),
        toDate: (new Date(new Date().getFullYear(), 11, 31)).toISOString()
    },

};

const reducer: Reducer<Model, Action> = (
    state: Model = initialModel,
    action: Action
) => {
    switch (action.type) {
        case ActionTypeKeys.TURN_ON_LOADER: return { ...state, loaderOn: true };
        case ActionTypeKeys.TURN_OFF_LOADER: return { ...state, loaderOn: false };
        case ActionTypeKeys.SET_DB_IS_ONLINE: return { ...state, isDbOnline: true };
        case ActionTypeKeys.SET_DB_IS_OFFLINE: return { ...state, isDbOnline: false };
        case ActionTypeKeys.SET_LOGGED_IN: return { ...state, loggedIn: true };
        case ActionTypeKeys.SET_LOGGED_OFF: return { ...initialModel, loggedIn: false, thememode: state.thememode };
        case ActionTypeKeys.SET_SITE_INITIALIZED: return { ...state, siteInitialized: true };
        case ActionTypeKeys.SWITCH_TO_LIGHT_MODE: { return { ...state, thememode: 'light' } }
        case ActionTypeKeys.SWITCH_TO_DARK_MODE: { return { ...state, thememode: 'dark' } }
        case ActionTypeKeys.SET_ACCESS_TOKEN: {
            const { accessToken } = action;
            return { ...state, accessToken: accessToken }
        }
        case ActionTypeKeys.SET_TOKEN_EXPIRY_DATE: {
            const { expiresInSeconds } = action;
            if (expiresInSeconds === 0) {
                return { ...state, tokenExpiryDate: '' }
            }
            const date = new Date()
            date.setSeconds(date.getSeconds() + expiresInSeconds);
            return { ...state, tokenExpiryDate: date.toISOString() }
        }
        case ActionTypeKeys.SET_USER_INFO: {
            const { info } = action;
            return { ...state, userInfo: info }
        }
        case ActionTypeKeys.SET_SHOW_PLAYLIST_MODAL: {
            const { show } = action;
            return { ...state, showPlaylistModal: show }
        }
        case ActionTypeKeys.SET_TOP_ARTISTS: {
            const { artists } = action;
            return { ...state, topArtists: artists, topArtistsLoaded: true }
        }
        case ActionTypeKeys.SET_PLAYLISTS: {
            const { playlists } = action;
            const sortedPlaylists = playlists.sort((a: Playlist, b: Playlist) => {
                let aName = a.name.toUpperCase();
                let bName = b.name.toUpperCase();
                return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
            });
            return { ...state, playlists: sortedPlaylists, playlistsLoaded: true }
        }
        case ActionTypeKeys.SET_SELECTED_PLAYLIST_ARTISTS: {
            const { artists } = action;
            return { ...state, selectedPlaylistArtists: artists }
        }
        case ActionTypeKeys.ADD_FESTIVAL_MATCH: {
            const { festival } = action;
            let is_new_festival = true
            const s0 = {
                ...state, festivalMatches: state.festivalMatches.map((old_festival: FestivalMatch) => {
                    if (old_festival.name === festival.name) {
                        is_new_festival = false
                        return festival
                    } else {
                        return old_festival
                    }
                })
            }
            if (is_new_festival) {
                return { ...state, festivalMatches: [...state.festivalMatches, festival] }
            }
            return s0
        }
        case ActionTypeKeys.ADD_FESTIVAL_MATCHES: {
            const { festivals } = action;
            return { ...state, festivalMatches: festivals }
        }
        case ActionTypeKeys.ADD_COUNTRIES: {
            const { countries } = action;
            return { ...state, countries: countries }
        }
        case ActionTypeKeys.ADD_CONTINENTS: {
            const { continents } = action;
            return { ...state, continents: continents }
        }
        case ActionTypeKeys.SET_MATCHING_METHOD: {
            const { method } = action;
            return { ...state, matchingMethod: method }
        }
        case ActionTypeKeys.SET_MATCH_SETTINGS: {
            const { settings } = action;
            return { ...state, matchSettings: settings }
        }
        default:
            return state;
    }
};

export default reducer
