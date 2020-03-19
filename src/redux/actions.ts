import {Action, ActionTypeKeys, Dispatch, Artist, MatchingResponse, FestivalMatch} from "./types";

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

export const addFestivalMatch = (festival: FestivalMatch): Action => {
    return {
        type: ActionTypeKeys.ADD_FESTIVAL_MATCH,
        festival: festival
    }
};

export const setCoachellaMatch = (matching_percent: number): Action => {
    return {
        type: ActionTypeKeys.SET_COACHELLA_MATCH,
        matching_percent: matching_percent
    }
};

export const setCoachellaMatchingArtists = (matching_artists: string[]): Action => {
    return {
        type: ActionTypeKeys.SET_COACHELLA_MATCHING_ARTISTS,
        matching_artists: matching_artists
    }
};

export const setRoskildeMatch = (matching_percent: number): Action => {
    return {
        type: ActionTypeKeys.SET_ROSKILDE_MATCH,
        matching_percent: matching_percent
    }
};

export const setRockWerchterMatch = (matching_percent: number): Action => {
    return {
        type: ActionTypeKeys.SET_ROCK_WERCHTER_MATCH,
        matching_percent: matching_percent
    }
};

export const testCoachellaMatch = (
    artists: Artist[],
    dispatch: Dispatch
    ) => {
    dispatch(turnOnLoader());
    const backendUrl = 'http://127.0.0.1:8000/onTour/coachellaMatch';
    /*(async () => {
        const rawResponse = await fetch('http://127.0.0.1:8000/onTour/coachellaMatch', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artists)
        });
        const content = await rawResponse.json();

        console.log(content);
    })();*/
    fetch('http://127.0.0.1:8000/onTour/coachellaMatch', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(artists)
    }).then((response: Response) => {
        response.text().then((id: string) => {
            const matching: MatchingResponse = JSON.parse(id)
            dispatch(setCoachellaMatch(matching.matching_percent));
            dispatch(setCoachellaMatchingArtists(matching.matching_artists));
        });
    }).catch((reason) => {
        console.log(reason);
    }).finally(() => dispatch(turnOffLoader()));;
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
