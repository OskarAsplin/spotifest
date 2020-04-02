import {ExampleModel} from "./example/exampleTypes";
import {PaletteType} from "@material-ui/core";

export type Dispatch = (action: any) => Promise<any>;

export interface DispatchProps {
    dispatch: Dispatch;
}

export interface Model {
    loaderOn: boolean;
    loggedIn: boolean;
    thememode: PaletteType;
    festivalMatches: FestivalMatch[];
}

export interface AppState {
    example: ExampleModel;
    model: Model
}

export type Action
    = TurnOnLoader
    | TurnOffLoader
    | SetLoggedIn
    | SetLoggedOff
    | SwitchToDarkMode
    | SwitchToLightMode
    | AddFestivalMatch

export enum ActionTypeKeys {
    TURN_ON_LOADER = "TURN_ON_LOADER",
    TURN_OFF_LOADER = "TURN_OFF_LOADER",
    SET_LOGGED_IN = "SET_LOGGED_IN",
    SET_LOGGED_OFF = "SET_LOGGED_OFF",
    SWITCH_TO_DARK_MODE = "SWITCH_TO_DARK_MODE",
    SWITCH_TO_LIGHT_MODE = "SWITCH_TO_LIGHT_MODE",
    ADD_FESTIVAL_MATCH = "ADD_FESTIVAL_MATCH",
}

export interface TurnOnLoader {
    type: ActionTypeKeys.TURN_ON_LOADER;
}

export interface TurnOffLoader {
    type: ActionTypeKeys.TURN_OFF_LOADER;
}

export interface SetLoggedIn {
    type: ActionTypeKeys.SET_LOGGED_IN;
}

export interface SetLoggedOff {
    type: ActionTypeKeys.SET_LOGGED_OFF;
}

export interface SwitchToDarkMode {
    type: ActionTypeKeys.SWITCH_TO_DARK_MODE;
}

export interface SwitchToLightMode {
    type: ActionTypeKeys.SWITCH_TO_LIGHT_MODE;
}

export interface AddFestivalMatch {
    type: ActionTypeKeys.ADD_FESTIVAL_MATCH;
    festival: FestivalMatch;
}


export interface Artist {
    name: string;
    spotifyId: string;
    picture: string;
    genres: string[];
}

export interface Lineup {
    festival: string;
    country: string;
    year: number;
    artists: Artist[];
}

export interface FestivalMatch {
    name: string,
    matching_percent_artists: number,
    matching_artists: string[],
    matching_percent_genres: number,
    matching_genres: string[]
}
