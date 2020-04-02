import {Action, ActionTypeKeys, Model, FestivalMatch} from "./types";
import {Reducer} from "redux";


export const initialModel: Model = {
    loaderOn: false,

    loggedIn: true,

    // Visnings
    thememode: 'light',

    //Logikk
    festivalMatches: []
};

const reducer: Reducer<Model, Action> = (
    state: Model = initialModel,
    action: Action
) => {
    switch (action.type) {
        case ActionTypeKeys.TURN_ON_LOADER: return {...state, loaderOn: true};
        case ActionTypeKeys.TURN_OFF_LOADER: return {...state, loaderOn: false};
        case ActionTypeKeys.SET_LOGGED_IN: return {...state, loggedIn: true};
        case ActionTypeKeys.SET_LOGGED_OFF: return {...state, loggedIn: false};
        case ActionTypeKeys.SWITCH_TO_LIGHT_MODE: {return {...state, thememode: 'light'}}
        case ActionTypeKeys.SWITCH_TO_DARK_MODE: {return {...state, thememode: 'dark'}}
        case ActionTypeKeys.ADD_FESTIVAL_MATCH: {
            const {festival} = action;
            let is_new_festival = true
            const s0 = {...state, festivalMatches: state.festivalMatches.map((old_festival: FestivalMatch) => {
                if (old_festival.name === festival.name) {
                    is_new_festival = false
                    return festival
                } else {
                    return old_festival
                }
            })}
            if (is_new_festival) {
                return {...state, festivalMatches: [...state.festivalMatches, festival]}
            }
            return s0
        }
        default:
            return state;
    }
};

export default reducer
