import countries_list from 'countries-list/dist/data.json';
import { fetchToJson, getApiBaseUrl } from '../utils/restUtils';
import {
  getShortDateISOString,
  getIconPicture,
  getBigPicture,
} from '../utils/utils';
import { setLoggedOff } from './reducers/authorizationSlice';
import {
  turnOnLoader,
  turnOffLoader,
  setSiteInitialized,
  setDbIsOnline,
  setDbIsOffline,
} from './reducers/displaySlice';
import {
  setMatchSettings,
  setPopularArtists,
  setCurrentPage,
  addFestivalMatches,
  addCountries,
  addContinents,
  initialMatchSettings,
} from './reducers/festivalMatchingSlice';
import {
  setUserInfo,
  setTopArtists,
  setPlaylists,
} from './reducers/spotifyAccountSlice';
import { AppThunk } from './store';
import {
  Artist,
  ArtistMinimal,
  MatchRequest,
  FestivalMatch,
  Area,
  UserInfo,
  Playlist,
  PopularArtistsDict,
} from './types';

import SpotifyWebApi from 'spotify-web-api-js';
export const spotifyApi = new SpotifyWebApi();

export const getPopularArtistsInLineups =
  (lineups: string[]): AppThunk =>
  (dispatch) => {
    fetch(getApiBaseUrl() + '/onTour/popularArtistsInLineups', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lineups),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setPopularArtists(data as PopularArtistsDict));
      })
      .catch((reason) => {
        console.log(reason);
        dispatch(setDbIsOffline());
      });
  };

export const testFestivalMatches =
  (
    artists: Artist[],
    numTracks: number,
    isTopArtists: Boolean,
    dateFrom: Date,
    dateTo: Date,
    continents?: string[],
    countries?: string[],
    states?: string[]
  ): AppThunk =>
  (dispatch) => {
    dispatch(turnOnLoader());
    dateFrom.setUTCHours(0);
    dateFrom.setDate(1); // Frist day of month
    dateTo.setUTCHours(0);
    dateTo.setMonth(dateTo.getMonth() + 1, 0); // Last day of month
    const matchRequest: MatchRequest = {
      artists: artists.map((artist) => {
        return {
          spotifyId: artist.spotifyId,
          userPopularity: artist.userPopularity,
        } as ArtistMinimal;
      }),
      genres: artists.flatMap((artist) => artist.genres),
      numTracks: numTracks,
      isTopArtists: isTopArtists,
      dateFrom: getShortDateISOString(dateFrom),
      dateTo: getShortDateISOString(dateTo),
      continents: continents ? continents : [],
      countries: countries ? countries : [],
      states: states ? states : [],
    };
    fetch(getApiBaseUrl() + '/onTour/festivalMatches', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchRequest),
    })
      .then((response) => response.json())
      .then((data) => {
        const festivalMatches = data as FestivalMatch[];
        dispatch(addFestivalMatches(festivalMatches));
        dispatch(setDbIsOnline());
        dispatch(setCurrentPage(1));
        if (festivalMatches.length > 0) {
          const firstPageLineups = festivalMatches
            .slice(0, 15)
            .map((match) => match.lineup_id);
          dispatch(getPopularArtistsInLineups(firstPageLineups));
        }
      })
      .catch((reason) => {
        console.log(reason);
        dispatch(setDbIsOffline());
      })
      .finally(() => dispatch(turnOffLoader()));
  };

const mapTopArtistToArtistObject = (
  artist: SpotifyApi.ArtistObjectFull,
  idx: number,
  totalTopArtists: number
) => {
  return {
    name: artist.name,
    spotifyId: artist.id,
    hasSpotifyId: true,
    iconPicture: getIconPicture(artist.images),
    bigPicture: getBigPicture(artist.images),
    popularity: artist.popularity,
    userPopularity: totalTopArtists * 2 - idx,
    genres: artist.genres,
  } as Artist;
};

const topArtistsCount = (numArtists: number) => {
  return (numArtists * (3 * numArtists + 1)) / 2; // n(3n+1)/2
};

Object.values =
  Object.values ||
  function (o: any) {
    return Object.keys(o).map(function (k) {
      return o[k];
    });
  };

export const initializeSite =
  (token: string): AppThunk =>
  (dispatch) => {
    dispatch(setDbIsOnline());
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    const getAvailableCountries = fetchToJson(
      getApiBaseUrl() + '/onTour/availableCountries'
    );
    const getAvailableContinents = fetchToJson(
      getApiBaseUrl() + '/onTour/availableContinents'
    );

    Promise.all([
      spotifyApi.getMe(),
      getAvailableCountries,
      getAvailableContinents,
    ])
      .then(
        ([
          responseGetMe,
          getAvailableCountriesReponse,
          getAvailableContinentsResponse,
        ]) => {
          const getMe: SpotifyApi.CurrentUsersProfileResponse =
            responseGetMe as SpotifyApi.CurrentUsersProfileResponse;
          const availableCountries: Area[] =
            getAvailableCountriesReponse as Area[];
          const countries: Area[] = [...availableCountries];
          const continents: Area[] = [
            ...(getAvailableContinentsResponse as Area[]),
          ];

          dispatch(addCountries(countries));
          dispatch(addContinents(continents));

          const userInfo: UserInfo = {
            country: getMe.country,
            displayName: getMe.display_name ? getMe.display_name : undefined,
            profilePictureUrl: getMe.images
              ? getMe.images[0]
                ? getMe.images[0].url
                : undefined
              : undefined,
            spotifyUrl: getMe.external_urls.spotify,
            id: getMe.id,
          };

          dispatch(setUserInfo(userInfo));

          const userContinent: string =
            getMe.country in (countries_list as any).countries
              ? (countries_list as any).countries[getMe.country].continent
              : '';
          const isRegisteredContinent = continents.find(
            (continent) => continent.isoCode === userContinent
          );
          const isEuropeOrNorthAmerica =
            userContinent === 'EU' || userContinent === 'NA';
          if (isRegisteredContinent && isEuropeOrNorthAmerica) {
            dispatch(
              setMatchSettings({
                ...initialMatchSettings,
                area: isRegisteredContinent,
              })
            );
          }

          dispatch(setSiteInitialized());

          Promise.all([
            spotifyApi.getMyTopArtists({ limit: 50, time_range: 'long_term' }),
            spotifyApi.getMyTopArtists({
              limit: 50,
              time_range: 'medium_term',
            }),
            spotifyApi.getMyTopArtists({ limit: 50, time_range: 'short_term' }),
          ])
            .then(
              ([responseLongTerm, responseMediumTerm, responseShortTerm]) => {
                const topArtistsLongTerm: Artist[] = responseLongTerm.items.map(
                  (artist, idx) =>
                    mapTopArtistToArtistObject(
                      artist,
                      idx,
                      responseLongTerm.items.length
                    )
                );
                const topArtistsMediumTerm: Artist[] =
                  responseMediumTerm.items.map((artist, idx) =>
                    mapTopArtistToArtistObject(
                      artist,
                      idx,
                      responseMediumTerm.items.length
                    )
                  );
                const topArtistsShortTerm: Artist[] =
                  responseShortTerm.items.map((artist, idx) =>
                    mapTopArtistToArtistObject(
                      artist,
                      idx,
                      responseShortTerm.items.length
                    )
                  );
                const countTopArtists =
                  topArtistsCount(responseLongTerm.items.length) +
                  topArtistsCount(responseMediumTerm.items.length) +
                  topArtistsCount(responseShortTerm.items.length);

                const tempDict: { [id: string]: Artist } = {};
                [
                  ...topArtistsLongTerm,
                  ...topArtistsMediumTerm,
                  ...topArtistsShortTerm,
                ].forEach((artist) => {
                  if (artist.spotifyId! in tempDict) {
                    tempDict[artist.spotifyId!].userPopularity! +=
                      artist.userPopularity!;
                  } else {
                    tempDict[artist.spotifyId!] = artist;
                  }
                });

                dispatch(
                  setTopArtists({
                    artists: Object.values(tempDict),
                    countTopArtists: countTopArtists,
                  })
                );
              }
            )
            .catch((error) => {
              console.log(error);
              dispatch(setLoggedOff());
            });

          dispatch(getAllPlaylists(getMe.id, 0, []));
        }
      )
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
  };

export const getAllPlaylists =
  (userId: string, offset: number, allPlaylists: Playlist[]): AppThunk =>
  (dispatch) => {
    spotifyApi
      .getUserPlaylists(userId, { limit: 50, offset: offset })
      .then((response: SpotifyApi.ListOfUsersPlaylistsResponse) => {
        const playlists: Playlist[] = response.items
          .map((playlist) => {
            if (playlist.tracks.total === 0) {
              return undefined;
            } else {
              return {
                name: playlist.name,
                id: playlist.id,
                images: playlist.images.map((image) => {
                  return image.url;
                }),
                ownerId: playlist.owner.id,
                numTracks: playlist.tracks.total,
              } as Playlist;
            }
          })
          .filter(Boolean) as Playlist[];

        if (response.total > offset + 50) {
          dispatch(
            getAllPlaylists(userId, offset + 50, allPlaylists.concat(playlists))
          );
        } else {
          allPlaylists = allPlaylists.concat(playlists);
          dispatch(setPlaylists(allPlaylists));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(setLoggedOff());
      });
  };
