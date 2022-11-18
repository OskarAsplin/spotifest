import countries_list from 'countries-list/dist/data.json';
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
import { Artist } from './types';
import {
  getDjangoAvailableContinents,
  getDjangoAvailableCountries,
  postDjangoFestivalMatches,
  postDjangoPopularArtistsInLineups,
} from '../utils/api/djangoApi';
import {
  getAllPlaylists,
  getAllTopArtistsWithPopularity,
  getSpotifyUserInfo,
  setSpotifyToken,
} from '../utils/api/spotifyApi';
import { createMatchRequest } from '../containers/FestivalMatchesDisplay.utils';

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
    const matchRequest = createMatchRequest({
      artists,
      numTracks,
      isTopArtists,
      dateFrom,
      dateTo,
      continents,
      countries,
      states,
    });
    postDjangoFestivalMatches(matchRequest)
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

export const initializeSite =
  (token: string): AppThunk =>
  (dispatch) => {
    dispatch(setDbIsOnline());
    if (token) setSpotifyToken(token);

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

        getAllTopArtistsWithPopularity()
          .then((value) => dispatch(setTopArtists(value)))
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
