import { ExampleModel } from "./example/exampleTypes";
import { PaletteType } from "@material-ui/core";

export type Dispatch = (action: any) => Promise<any>;

export interface DispatchProps {
    dispatch: Dispatch;
}

export interface Model {
    loaderOn: boolean;
    loggedIn: boolean;
    thememode: PaletteType;
    accessToken: string;
    userInfo?: UserInfo;
    topArtists: Artist[];
    playlists: Playlist[];
    festivalMatches: FestivalMatch[];
    matchingMethod: MatchingMethod;
    countries: Area[];
    continents: Area[];
    chosenArea: Area;
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
    | SetAccessToken
    | SetUserInfo
    | SetTopArtists
    | SetPlaylists
    | AddFestivalMatch
    | AddFestivalMatches
    | AddCountries
    | AddContinents
    | SetMatchingMethod
    | SetChosenArea

export enum ActionTypeKeys {
    TURN_ON_LOADER = "TURN_ON_LOADER",
    TURN_OFF_LOADER = "TURN_OFF_LOADER",
    SET_LOGGED_IN = "SET_LOGGED_IN",
    SET_LOGGED_OFF = "SET_LOGGED_OFF",
    SWITCH_TO_DARK_MODE = "SWITCH_TO_DARK_MODE",
    SWITCH_TO_LIGHT_MODE = "SWITCH_TO_LIGHT_MODE",
    SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
    SET_USER_INFO = "SET_USER_INFO",
    SET_TOP_ARTISTS = "SET_TOP_ARTISTS",
    SET_PLAYLISTS = "SET_PLAYLISTS",
    ADD_FESTIVAL_MATCH = "ADD_FESTIVAL_MATCH",
    ADD_FESTIVAL_MATCHES = "ADD_FESTIVAL_MATCHES",
    ADD_COUNTRIES = "ADD_COUNTRIES",
    ADD_CONTINENTS = "ADD_CONTINENTS",
    SET_MATCHING_METHOD = "SET_MATCHING_METHOD",
    SET_CHOSEN_AREA = "SET_CHOSEN_AREA",
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

export interface SetAccessToken {
    type: ActionTypeKeys.SET_ACCESS_TOKEN;
    accessToken: string;
}

export interface SetUserInfo {
    type: ActionTypeKeys.SET_USER_INFO;
    info: UserInfo;
}

export interface SetTopArtists {
    type: ActionTypeKeys.SET_TOP_ARTISTS;
    artists: Artist[];
}

export interface SetPlaylists {
    type: ActionTypeKeys.SET_PLAYLISTS;
    playlists: Playlist[];
}

export interface AddFestivalMatch {
    type: ActionTypeKeys.ADD_FESTIVAL_MATCH;
    festival: FestivalMatch;
}

export interface AddFestivalMatches {
    type: ActionTypeKeys.ADD_FESTIVAL_MATCHES;
    festivals: FestivalMatch[];
}

export interface AddCountries {
    type: ActionTypeKeys.ADD_COUNTRIES;
    countries: Area[];
}

export interface AddContinents {
    type: ActionTypeKeys.ADD_CONTINENTS;
    continents: Area[];
}

export interface SetMatchingMethod {
    type: ActionTypeKeys.SET_MATCHING_METHOD;
    method: MatchingMethod;
}

export interface SetChosenArea {
    type: ActionTypeKeys.SET_CHOSEN_AREA;
    area: Area;
}


export interface UserInfo {
    country: string;
    displayName?: string;
    profilePictureUrl?: string;
    spotifyUrl: string;
    id: string;
}

export interface Playlist {
    name: string;
    id: string;
    images: string[];
    ownerId: string;
    numTracks: number;
}

export interface Artist {
    name: string;
    spotifyId?: string;
    picture?: string;
    popularity: number;
    genres: string[];
}

export interface Lineup {
    festival: string;
    year: number;
    artists: Artist[];
}

export interface MatchRequest {
    artists: Artist[],
    isTopArtists: Boolean,
    continents: string[],
    countries: string[]
}

export interface FestivalMatch {
    name: string,
    locationText: string,
    date: string,
    year: number,
    cancelled: boolean,
    matching_percent_artists: number,
    matching_artists: Artist[],
    popular_artists: Artist[],
    matching_percent_genres: number,
    matching_genres: string[],
    lineupImg: string,
    festivalImg: string,
    webpage: string,
    ticketWebpage: string,
    video: string,
}

export interface Area {
    name: string,
    isoCode: string
}

export enum MatchingMethod {
    Genre,
    Artist
}

export interface YearLineup {
    year: string,
    lineup: string
}

export interface RegisterYearLineup {
    festival: string,
    yearLineup: YearLineup
}

export interface RegisterFestival {
    name: string,
    date: string,
    month: string,
    month2: string,
    cancelled: boolean,
    year: string,
    location: string,
    country: string,
    video: string,
    poster: string,
    official_website: string,
    tickets_website: string,
    photos: string[],
    lineups: YearLineup[]
}

export interface YearLineupFormatted {
    year: number
    lineup: Artist[]
}

export interface FestivalMetadata {
    name: string,
    date: string,
    month: string,
    month2: string,
    cancelled: boolean,
    year: number,
    location: string,
    country: string,
    video: string,
    poster: string,
    official_website: string,
    tickets_website: string,
    photos: string[]
}
