import countries_list from 'countries-list/dist/data.json';
import { getShortDateISOString } from '../utils/utils';
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
import { Artist, MatchRequest, Playlist } from './types';

import SpotifyWebApi from 'spotify-web-api-js';
import { mapToArtistMinimal } from '../utils/mappers';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
  postDjangoFestivalMatches,
  postDjangoPopularArtistsInLineups,
} from '../utils/api/djangoApi';
import {
  mapSpotifyPlaylistToPlaylist,
  mapToArtistWithPopularity,
  mapToUserInfo,
} from '../utils/api/mappers';

export const spotifyApi = new SpotifyWebApi();

export const getPopularArtistsInLineups =
  (lineups: string[]): AppThunk =>
  (dispatch) => {
    postDjangoPopularArtistsInLineups({ lineups })
      .then((popularArtistsDict) =>
        dispatch(setPopularArtists(popularArtistsDict))
      )
      .catch(() => dispatch(setDbIsOffline()));
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
      artists: artists.map(mapToArtistMinimal),
      genres: artists.flatMap((artist) => artist.genres),
      numTracks: numTracks,
      isTopArtists: isTopArtists,
      dateFrom: getShortDateISOString(dateFrom),
      dateTo: getShortDateISOString(dateTo),
      continents: continents ?? [],
      countries: countries ?? [],
      states: states ?? [],
    };
    postDjangoFestivalMatches({ matchRequest })
      .then((festivalMatches) => {
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
      .catch(() => dispatch(setDbIsOffline()))
      .finally(() => dispatch(turnOffLoader()));
  };

const topArtistsCount = (numArtists: number) =>
  (numArtists * (3 * numArtists + 1)) / 2; // n(3n+1)/2

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
    const availableCountriesPromise = getDjangoAvailableCountries();
    const availableContinentsPromise = getDjangoAvailableContinents();

    Promise.all([
      spotifyApi.getMe(),
      availableCountriesPromise,
      availableContinentsPromise,
    ])
      .then(([getMe, availableCountries, availableContinents]) => {
        dispatch(addCountries(availableCountries));
        dispatch(addContinents(availableContinents));
        dispatch(setUserInfo(mapToUserInfo(getMe)));

        const userContinent: string =
          getMe.country in (countries_list as any).countries
            ? (countries_list as any).countries[getMe.country].continent
            : '';
        const isRegisteredContinent = availableContinents.find(
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
          .then(([responseLongTerm, responseMediumTerm, responseShortTerm]) => {
            const topArtistsLongTerm: Artist[] = responseLongTerm.items.map(
              (artist, idx) =>
                mapToArtistWithPopularity(
                  artist,
                  idx,
                  responseLongTerm.items.length
                )
            );
            const topArtistsMediumTerm: Artist[] = responseMediumTerm.items.map(
              (artist, idx) =>
                mapToArtistWithPopularity(
                  artist,
                  idx,
                  responseMediumTerm.items.length
                )
            );
            const topArtistsShortTerm: Artist[] = responseShortTerm.items.map(
              (artist, idx) =>
                mapToArtistWithPopularity(
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
          })
          .catch(() => dispatch(setLoggedOff()));

        dispatch(getAllPlaylists(getMe.id, 0, []));
      })
      .catch((error) => {
        if (error instanceof XMLHttpRequest) {
          if (error.status === 401) dispatch(setLoggedOff());
        }
        if (error instanceof TypeError) dispatch(setDbIsOffline());
      });
  };

export const getAllPlaylists =
  (userId: string, offset: number, allPlaylists: Playlist[]): AppThunk =>
  (dispatch) => {
    spotifyApi
      .getUserPlaylists(userId, { limit: 50, offset: offset })
      .then((response: SpotifyApi.ListOfUsersPlaylistsResponse) => {
        const playlists: Playlist[] = response.items
          .filter((playlist) => playlist.tracks.total > 0)
          .map(mapSpotifyPlaylistToPlaylist);

        if (response.total > offset + 50) {
          dispatch(
            getAllPlaylists(userId, offset + 50, allPlaylists.concat(playlists))
          );
        } else {
          allPlaylists = allPlaylists.concat(playlists);
          dispatch(setPlaylists(allPlaylists));
        }
      })
      .catch(() => dispatch(setLoggedOff()));
  };
