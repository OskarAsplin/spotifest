import { ExampleModel } from "./example/exampleTypes";
import { PaletteType } from "@material-ui/core";

export type Dispatch = (action: any) => Promise<any>;

export interface DispatchProps {
    dispatch: Dispatch;
}

export interface Model {
    loaderOn: boolean;
    loggedIn: boolean;
    siteInitialized: boolean;
    isDbOnline: boolean;
    thememode: PaletteType;
    accessToken: string;
    tokenExpiryDate: string;
    userInfo?: UserInfo;
    showPlaylistModal: boolean;
    topArtists: Artist[];
    playlists: Playlist[];
    topArtistsLoaded: boolean;
    playlistsLoaded: boolean;
    countTopArtists: number;
    selectedPlaylistArtists: Artist[];
    festivalMatches: FestivalMatch[];
    popularArtists: PopularArtistsDict;
    matchingMethod: MatchingMethod;
    countries: Area[];
    continents: Area[];
    matchSettings: MatchSettings;
    currentPage: number;
}

export interface AppState {
    example: ExampleModel;
    model: Model
}

export type Action
    = TurnOnLoader
    | TurnOffLoader
    | SetDbIsOnline
    | SetDbIsOffline
    | SetLoggedIn
    | SetLoggedOff
    | SetSiteInitialized
    | SwitchToDarkMode
    | SwitchToLightMode
    | SetAccessToken
    | SetTokenExpiryDate
    | SetUserInfo
    | SetShowPlaylistModal
    | SetTopArtists
    | SetPlaylists
    | SetSelectedPlaylistArtists
    | AddFestivalMatches
    | SetPopularArtists
    | AddCountries
    | AddContinents
    | SetMatchingMethod
    | SetMatchSettings
    | SetCurrentPage

export enum ActionTypeKeys {
    TURN_ON_LOADER = "TURN_ON_LOADER",
    TURN_OFF_LOADER = "TURN_OFF_LOADER",
    SET_DB_IS_ONLINE = "SET_DB_IS_ONLINE",
    SET_DB_IS_OFFLINE = "SET_DB_IS_OFFLINE",
    SET_LOGGED_IN = "SET_LOGGED_IN",
    SET_LOGGED_OFF = "SET_LOGGED_OFF",
    SET_SITE_INITIALIZED = "SET_SITE_INITIALIZED",
    SWITCH_TO_DARK_MODE = "SWITCH_TO_DARK_MODE",
    SWITCH_TO_LIGHT_MODE = "SWITCH_TO_LIGHT_MODE",
    SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
    SET_TOKEN_EXPIRY_DATE = "SET_TOKEN_EXPIRY_DATE",
    SET_USER_INFO = "SET_USER_INFO",
    SET_SHOW_PLAYLIST_MODAL = "SET_SHOW_PLAYLIST_MODAL",
    SET_TOP_ARTISTS = "SET_TOP_ARTISTS",
    SET_PLAYLISTS = "SET_PLAYLISTS",
    SET_SELECTED_PLAYLIST_ARTISTS = "SET_SELECTED_PLAYLIST_ARTISTS",
    ADD_FESTIVAL_MATCHES = "ADD_FESTIVAL_MATCHES",
    SET_POPULAR_ARTISTS = "SET_POPULAR_ARTISTS",
    ADD_COUNTRIES = "ADD_COUNTRIES",
    ADD_CONTINENTS = "ADD_CONTINENTS",
    SET_MATCHING_METHOD = "SET_MATCHING_METHOD",
    SET_MATCH_SETTINGS = "SET_MATCH_SETTINGS",
    SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
}

export interface TurnOnLoader {
    type: ActionTypeKeys.TURN_ON_LOADER;
}

export interface TurnOffLoader {
    type: ActionTypeKeys.TURN_OFF_LOADER;
}

export interface SetDbIsOnline {
    type: ActionTypeKeys.SET_DB_IS_ONLINE;
}

export interface SetDbIsOffline {
    type: ActionTypeKeys.SET_DB_IS_OFFLINE;
}

export interface SetLoggedIn {
    type: ActionTypeKeys.SET_LOGGED_IN;
}

export interface SetLoggedOff {
    type: ActionTypeKeys.SET_LOGGED_OFF;
}

export interface SetSiteInitialized {
    type: ActionTypeKeys.SET_SITE_INITIALIZED;
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

export interface SetTokenExpiryDate {
    type: ActionTypeKeys.SET_TOKEN_EXPIRY_DATE;
    expiresInSeconds: number;
}

export interface SetUserInfo {
    type: ActionTypeKeys.SET_USER_INFO;
    info: UserInfo;
}

export interface SetShowPlaylistModal {
    type: ActionTypeKeys.SET_SHOW_PLAYLIST_MODAL;
    show: boolean;
}

export interface SetTopArtists {
    type: ActionTypeKeys.SET_TOP_ARTISTS;
    artists: Artist[];
    countTopArtists: number;
}

export interface SetPlaylists {
    type: ActionTypeKeys.SET_PLAYLISTS;
    playlists: Playlist[];
}

export interface SetSelectedPlaylistArtists {
    type: ActionTypeKeys.SET_SELECTED_PLAYLIST_ARTISTS;
    artists: Artist[];
}

export interface AddFestivalMatches {
    type: ActionTypeKeys.ADD_FESTIVAL_MATCHES;
    festivals: FestivalMatch[];
}

export interface SetPopularArtists {
    type: ActionTypeKeys.SET_POPULAR_ARTISTS;
    popularArtistsDict: PopularArtistsDict;
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

export interface SetMatchSettings {
    type: ActionTypeKeys.SET_MATCH_SETTINGS;
    settings: MatchSettings;
}

export interface SetCurrentPage {
    type: ActionTypeKeys.SET_CURRENT_PAGE;
    page: number;
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
    hasSpotifyId: boolean;
    iconPicture?: string;
    bigPicture?: string;
    popularity: number;
    userPopularity?: number;
    genres: string[];
}

export interface ArtistMinimal {
    spotifyId: string;
    userPopularity: number;
}

export interface Lineup {
    festival: string;
    year: number;
    from_date_iso: string;
    to_date_iso: string;
    date_str: string;
    cancelled: boolean;
    artists: Artist[];
    poster: string;
}

export interface PopularArtistsDict {
    [id: string]: Artist[];
}

export interface MatchRequest {
    artists: ArtistMinimal[],
    genres: string[],
    numTracks: number,
    isTopArtists: Boolean,
    dateFrom: string,
    dateTo: string,
    continents: string[],
    countries: string[],
    states: string[]
}

export interface FestivalMatch {
    lineup_id: string,
    name: string,
    locationText: string,
    country: string,
    date: string,
    year: number,
    cancelled: boolean,
    matching_percent_artists: number,
    matching_artists: string[],
    matching_percent_genres: number,
    matching_percent_combined: number,
    top_genres: string[],
    lineupImg: string,
    festivalImg: string,
}

export interface FestivalMatchExtended extends FestivalMatch {
    popular_artists: Artist[]
}

export interface FestivalInfo {
    name: string,
    locationText: string,
    country: string,
    genres: string[],
    festivalImg: string,
    webpage: string,
    ticketWebpage: string,
    crawledWebpage: string,
    video: string,
    lineups: Lineup[],
}

export interface ArtistInfo {
    artist: Artist,
    festivalsFuture: FestivalMatchExtended[],
    festivalsPast: FestivalMatchExtended[]
}

export interface Area {
    name: string,
    isoCode: string
}

export interface MatchSettings {
    matchBasis: string,
    area: Area,
    fromDate: string,
    toDate: string,
    numTracks: number
}

export interface SearchResponse {
    festivals: { name: string, location: string, country: string, }[],
    artists: { name: string }[]
}

export enum MatchingMethod {
    Genre,
    Artist
}
