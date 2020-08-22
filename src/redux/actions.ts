import { Action, ActionTypeKeys, Dispatch, Artist, ArtistMinimal, MatchRequest, FestivalMatch, Area, MatchSettings, MatchingMethod, UserInfo, Playlist, PopularArtistsDict } from "./types";
import { fetchToJson, getApiBaseUrl } from "../utils/restUtils";
import { getShortDateISOString, getIconPicture, getBigPicture } from "../utils/utils";
import countries_list from 'countries-list/dist/data.json';
import { initialModel } from './reducer'


import SpotifyWebApi from 'spotify-web-api-js';
export const spotifyApi = new SpotifyWebApi();

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

export const setDbIsOnline = (): Action => {
    return {
        type: ActionTypeKeys.SET_DB_IS_ONLINE
    }
};

export const setDbIsOffline = (): Action => {
    return {
        type: ActionTypeKeys.SET_DB_IS_OFFLINE
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

export const setSiteInitialized = (): Action => {
    return {
        type: ActionTypeKeys.SET_SITE_INITIALIZED
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

export const setAccessToken = (accessToken: string): Action => {
    return {
        type: ActionTypeKeys.SET_ACCESS_TOKEN,
        accessToken: accessToken
    }
};

export const setTokenExpiryDate = (expiresInSeconds: number): Action => {
    return {
        type: ActionTypeKeys.SET_TOKEN_EXPIRY_DATE,
        expiresInSeconds: expiresInSeconds
    }
};

export const setUserInfo = (info: UserInfo): Action => {
    return {
        type: ActionTypeKeys.SET_USER_INFO,
        info: info
    }
};

export const setShowPlaylistModal = (show: boolean): Action => {
    return {
        type: ActionTypeKeys.SET_SHOW_PLAYLIST_MODAL,
        show: show
    }
};

export const setTopArtists = (artists: Artist[], countTopArtists: number): Action => {
    return {
        type: ActionTypeKeys.SET_TOP_ARTISTS,
        artists: artists,
        countTopArtists: countTopArtists
    }
};

export const setPlaylists = (playlists: Playlist[]): Action => {
    return {
        type: ActionTypeKeys.SET_PLAYLISTS,
        playlists: playlists
    }
};

export const setSelectedPlaylistArtists = (artists: Artist[]): Action => {
    return {
        type: ActionTypeKeys.SET_SELECTED_PLAYLIST_ARTISTS,
        artists: artists
    }
};

export const addCountries = (countries: Area[]): Action => {
    return {
        type: ActionTypeKeys.ADD_COUNTRIES,
        countries: countries
    }
};

export const addContinents = (continents: Area[]): Action => {
    return {
        type: ActionTypeKeys.ADD_CONTINENTS,
        continents: continents
    }
};

export const addFestivalMatches = (festivals: FestivalMatch[]): Action => {
    return {
        type: ActionTypeKeys.ADD_FESTIVAL_MATCHES,
        festivals: festivals
    }
};

export const setPopularArtists = (popularArtistsDict: PopularArtistsDict): Action => {
    return {
        type: ActionTypeKeys.SET_POPULAR_ARTISTS,
        popularArtistsDict: popularArtistsDict
    }
};

export const setMatchingMethod = (method: MatchingMethod): Action => {
    return {
        type: ActionTypeKeys.SET_MATCHING_METHOD,
        method: method
    }
};

export const setMatchSettings = (settings: MatchSettings): Action => {
    return {
        type: ActionTypeKeys.SET_MATCH_SETTINGS,
        settings: settings
    }
};

export const setCurrentPage = (page: number): Action => {
    return {
        type: ActionTypeKeys.SET_CURRENT_PAGE,
        page: page
    }
};

export const getPopularArtistsInLineups = (
    lineups: string[],
    dispatch: Dispatch
) => {
    fetch(getApiBaseUrl() + '/onTour/popularArtistsInLineups', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lineups)
    }).then(response => response.json())
    .then((data) => {
        dispatch(setPopularArtists(data as PopularArtistsDict));
    }).catch((reason) => {
        console.log(reason);
        dispatch(setDbIsOffline());
    });
};

export const testFestivalMatches = (
    artists: Artist[],
    numTracks: number,
    isTopArtists: Boolean,
    dispatch: Dispatch,
    dateFrom: Date,
    dateTo: Date,
    continents?: string[],
    countries?: string[],
    states?: string[]
) => {
    dispatch(turnOnLoader());
    dateFrom.setUTCHours(0);
    dateFrom.setDate(1) // Frist day of month
    dateTo.setUTCHours(0);
    dateTo.setMonth(dateTo.getMonth() + 1, 0); // Last day of month
    const matchRequest: MatchRequest = {
        artists: artists.map((artist) => { return { spotifyId: artist.spotifyId, userPopularity: artist.userPopularity } as ArtistMinimal}),
        genres: artists.flatMap((artist) => artist.genres),
        numTracks: numTracks,
        isTopArtists: isTopArtists,
        dateFrom: getShortDateISOString(dateFrom),
        dateTo: getShortDateISOString(dateTo),
        continents: continents ? continents : [],
        countries: countries ? countries : [],
        states: states ? states : []
    }
    fetch(getApiBaseUrl() + '/onTour/festivalMatches', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchRequest)
    }).then(response => response.json())
    .then((data) => {
        const festivalMatches = data as FestivalMatch[];
        dispatch(addFestivalMatches(festivalMatches));
        dispatch(setDbIsOnline());
        if (festivalMatches.length > 0) {
            const firstPageLineups = festivalMatches.slice(0, 15).map(match => match.lineup_id);
            getPopularArtistsInLineups(firstPageLineups, dispatch);
        }
    }).catch((reason) => {
        console.log(reason);
        dispatch(setDbIsOffline());
    }).finally(() => dispatch(turnOffLoader()));
};

const mapTopArtistToArtistObject = (artist: SpotifyApi.ArtistObjectFull, idx: number, totalTopArtists: number) => {
    return {
        name: artist.name,
        spotifyId: artist.id,
        hasSpotifyId: true,
        iconPicture: getIconPicture(artist.images),
        bigPicture: getBigPicture(artist.images),
        popularity: artist.popularity,
        userPopularity: totalTopArtists * 2 - idx,
        genres: artist.genres
    } as Artist;
}

const topArtistsCount = (numArtists: number) => {
    return numArtists * (3 * numArtists + 1) / 2;  // n(3n+1)/2
};

Object.values = Object.values || function(o: any) { return Object.keys(o).map(function(k) { return o[k] }) };

export const initializeSite = (
    token: string,
    dispatch: Dispatch
) => {
    dispatch(setDbIsOnline());
    if (token) {
        spotifyApi.setAccessToken(token);
    }
    const getAvailableCountries = fetchToJson(getApiBaseUrl() + '/onTour/availableCountries');
    const getAvailableContinents = fetchToJson(getApiBaseUrl() + '/onTour/availableContinents');

    Promise.all([spotifyApi.getMe(), getAvailableCountries, getAvailableContinents])
        .then(([responseGetMe, getAvailableCountriesReponse, getAvailableContinentsResponse]) => {
            const getMe: SpotifyApi.CurrentUsersProfileResponse = responseGetMe as SpotifyApi.CurrentUsersProfileResponse;
            const countries: Area[] = getAvailableCountriesReponse as Area[];
            const continents: Area[] = getAvailableContinentsResponse as Area[];

            dispatch(addCountries(countries));
            dispatch(addContinents(continents));

            const userInfo: UserInfo = {
                country: getMe.country,
                displayName: getMe.display_name ? getMe.display_name : undefined,
                profilePictureUrl: getMe.images ? getMe.images[0] ? getMe.images[0].url : undefined : undefined,
                spotifyUrl: getMe.external_urls.spotify,
                id: getMe.id
            }

            dispatch(setUserInfo(userInfo));

            const userContinent: string = getMe.country in (countries_list as any).countries ?
                (countries_list as any).countries[getMe.country].continent : '';
            const isRegisteredContinent = continents.find(continent => continent.isoCode === userContinent);
            const isEuropeOrNorthAmerica = userContinent === 'EU' || userContinent === 'NA';
            if (isRegisteredContinent && isEuropeOrNorthAmerica) {
                dispatch(setMatchSettings({ ...initialModel.matchSettings, area: isRegisteredContinent }));
            }

            dispatch(setSiteInitialized());

            Promise.all([
                spotifyApi.getMyTopArtists({ limit: 50, time_range: 'long_term' }),
                spotifyApi.getMyTopArtists({ limit: 50, time_range: 'medium_term' }),
                spotifyApi.getMyTopArtists({ limit: 50, time_range: 'short_term' })
                ]).then(([responseLongTerm, responseMediumTerm, responseShortTerm]) => {
                    const topArtistsLongTerm: Artist[] = responseLongTerm.items.map((artist, idx) => mapTopArtistToArtistObject(artist, idx, responseLongTerm.items.length));
                    const topArtistsMediumTerm: Artist[] = responseMediumTerm.items.map((artist, idx) => mapTopArtistToArtistObject(artist, idx, responseMediumTerm.items.length));
                    const topArtistsShortTerm: Artist[] = responseShortTerm.items.map((artist, idx) => mapTopArtistToArtistObject(artist, idx, responseShortTerm.items.length));
                    const countTopArtists = topArtistsCount(responseLongTerm.items.length) + topArtistsCount(responseMediumTerm.items.length) + topArtistsCount(responseShortTerm.items.length);

                    const tempDict: {[id: string]: Artist} = {};
                    [...topArtistsLongTerm, ...topArtistsMediumTerm, ...topArtistsShortTerm].forEach((artist) => {
                        if (artist.spotifyId! in tempDict) {
                            tempDict[artist.spotifyId!].userPopularity! += artist.userPopularity!;
                        } else {
                            tempDict[artist.spotifyId!] = artist;
                        }
                    });

                    dispatch(setTopArtists(Object.values(tempDict), countTopArtists));
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(setLoggedOff());
                })

            getAllPlaylists(getMe.id, 0, [], dispatch);
        })
        .catch((error) => {
            if (error instanceof XMLHttpRequest) {
                if (error.status === 401) {
                    dispatch(setLoggedOff());
                }
            }
            if (error instanceof TypeError) {
                dispatch(setDbIsOffline());
            }
            console.log('status code: ' + error.status);
            console.log(error);
        });
}

export const getAllPlaylists = (
    userId: string,
    offset: number,
    allPlaylists: Playlist[],
    dispatch: Dispatch
) => {
    spotifyApi.getUserPlaylists(userId, { limit: 50, offset: offset })
        .then((response: SpotifyApi.ListOfUsersPlaylistsResponse) => {

            const playlists: Playlist[] = response.items.map((playlist) => {
                if (playlist.tracks.total === 0) {
                    return undefined;
                } else {
                    return {
                        name: playlist.name,
                        id: playlist.id,
                        images: playlist.images.map((image) => { return image.url; }),
                        ownerId: playlist.owner.id,
                        numTracks: playlist.tracks.total
                    } as Playlist;
                }
            }).filter(Boolean) as Playlist[];

            if (response.total > offset + 50) {
                getAllPlaylists(userId, offset + 50, allPlaylists.concat(playlists), dispatch);
            } else {
                allPlaylists = allPlaylists.concat(playlists);
                dispatch(setPlaylists(allPlaylists));
            }
        })
        .catch((error) => {
            console.log(error);
            dispatch(setLoggedOff());
        })
}
