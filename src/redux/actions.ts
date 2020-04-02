import {Action, ActionTypeKeys, Dispatch, Artist, FestivalMatch, Lineup, MatchingMethod, UserInfo, Playlist} from "./types";

export const turnOnLoader = (): Action => {
    return {
        type: ActionTypeKeys.TURN_ON_LOADER
    }
};

export const turnOffLoader = (): Action => {
    return {
        type: ActionTypeKeys.TURN_OFF_LOADER
    }
};

export const setLoggedIn = (): Action => {
    return {
        type: ActionTypeKeys.SET_LOGGED_IN
    }
};

export const setLoggedOff = (): Action => {
    return {
        type: ActionTypeKeys.SET_LOGGED_OFF
    }
};

export const switchToDarkMode = (): Action => {
    return {
        type: ActionTypeKeys.SWITCH_TO_DARK_MODE,
    }
};

export const switchToLightMode = (): Action => {
    return {
        type: ActionTypeKeys.SWITCH_TO_LIGHT_MODE,
    }
};

export const setUserInfo = (info: UserInfo): Action => {
    return {
        type: ActionTypeKeys.SET_USER_INFO,
        info: info
    }
};

export const setTopArtists = (artists: Artist[]): Action => {
    return {
        type: ActionTypeKeys.SET_TOP_ARTISTS,
        artists: artists
    }
};

export const setPlaylists = (playlists: Playlist[]): Action => {
    return {
        type: ActionTypeKeys.SET_PLAYLISTS,
        playlists: playlists
    }
};

export const addFestivalMatch = (festival: FestivalMatch): Action => {
    return {
        type: ActionTypeKeys.ADD_FESTIVAL_MATCH,
        festival: festival
    }
};

export const setMatchingMethod = (method: MatchingMethod): Action => {
    return {
        type: ActionTypeKeys.SET_MATCHING_METHOD,
        method: method
    }
};

export const testFestivalMatches = (
    artists: Artist[],
    dispatch: Dispatch
    ) => {
    dispatch(turnOnLoader());
    const backendUrl = 'http://127.0.0.1:8000/onTour/festivalMatches';
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(artists)
    }).then((response: Response) => {
        response.text().then((id: string) => {
            const matching_festivals: FestivalMatch[] = JSON.parse(id)
            for (let match of matching_festivals) {
                dispatch(addFestivalMatch(match));
            }
        });
    }).catch((reason) => {
        console.log(reason);
    }).finally(() => dispatch(turnOffLoader()));;
};

export const registerLineup = (
    lineup: Lineup,
    dispatch: Dispatch
    ) => {
    dispatch(turnOnLoader());
    const backendUrl = 'http://127.0.0.1:8000/onTour/' + lineup.festival + '/register';
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lineup)
    }).catch((reason) => {
        console.log(reason);
    }).finally(() => dispatch(turnOffLoader()));;
};
