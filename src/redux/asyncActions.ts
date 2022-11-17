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
import { Artist, MatchRequest } from './types';
import { mapToArtistMinimal } from '../utils/mappers';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
  postDjangoFestivalMatches,
  postDjangoPopularArtistsInLineups,
} from '../utils/api/djangoApi';
import {
  getAllPlaylists,
  getSpotifyUserInfo,
  getTopArtistsWithPopularity,
  spotifyApi,
} from '../utils/api/spotifyApi';

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

export const initializeSite =
  (token: string): AppThunk =>
  (dispatch) => {
    dispatch(setDbIsOnline());
    if (token) spotifyApi.setAccessToken(token);

    Promise.all([
      getSpotifyUserInfo(),
      getDjangoAvailableCountries(),
      getDjangoAvailableContinents(),
    ])
      .then(([userInfo, availableCountries, availableContinents]) => {
        dispatch(setUserInfo(userInfo));
        dispatch(addCountries(availableCountries));
        dispatch(addContinents(availableContinents));

        const userContinent: string =
          userInfo.country in countries_list.countries
            ? countries_list.countries[
                userInfo.country as keyof typeof countries_list.countries
              ].continent
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
          getTopArtistsWithPopularity({ timeRange: 'long_term' }),
          getTopArtistsWithPopularity({ timeRange: 'medium_term' }),
          getTopArtistsWithPopularity({ timeRange: 'short_term' }),
        ])
          .then(([topLongTerm, topMediumTerm, topShortTerm]) => {
            const countTopArtists =
              topArtistsCount(topLongTerm.length) +
              topArtistsCount(topMediumTerm.length) +
              topArtistsCount(topShortTerm.length);

            const tempDict: { [id: string]: Artist } = {};
            [...topLongTerm, ...topMediumTerm, ...topShortTerm].forEach(
              (artist) => {
                if (artist.spotifyId! in tempDict) {
                  tempDict[artist.spotifyId!].userPopularity! +=
                    artist.userPopularity!;
                } else {
                  tempDict[artist.spotifyId!] = artist;
                }
              }
            );

            dispatch(
              setTopArtists({
                artists: Object.values(tempDict),
                countTopArtists,
              })
            );
          })
          .catch(() => dispatch(setLoggedOff()));

        dispatch(setAllPlaylistsInRedux(userInfo.id));
      })
      .catch((error) => {
        if (error instanceof XMLHttpRequest) {
          if (error.status === 401) dispatch(setLoggedOff());
        }
        if (error instanceof TypeError) dispatch(setDbIsOffline());
      });
  };

export const setAllPlaylistsInRedux =
  (userId: string): AppThunk =>
  async (dispatch) => {
    const allPlaylists = await getAllPlaylists({ userId });
    dispatch(setPlaylists(allPlaylists));
  };
