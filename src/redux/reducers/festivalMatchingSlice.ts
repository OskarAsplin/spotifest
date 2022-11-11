import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  Artist,
  FestivalMatch,
  PopularArtistsDict,
  Area,
  MatchSettings,
} from '../types';
import { INITIAL_FROM_DATE, INITIAL_TO_DATE } from '../../config';

interface FestivalMatchingState {
  selectedPlaylistArtists: Artist[];
  festivalMatches: FestivalMatch[];
  popularArtists: PopularArtistsDict;
  countries: Area[];
  continents: Area[];
  matchSettings: MatchSettings;
  currentPage: number;
}

export const initialMatchSettings: MatchSettings = {
  matchBasis: '',
  area: { name: 'Worldwide', isoCode: 'XXX' },
  fromDate: INITIAL_FROM_DATE.toISOString(),
  toDate: INITIAL_TO_DATE.toISOString(),
  numTracks: 0,
};

const initialState: FestivalMatchingState = {
  selectedPlaylistArtists: [],
  festivalMatches: [],
  popularArtists: {},
  countries: [],
  continents: [],
  matchSettings: initialMatchSettings,
  currentPage: 1,
};

export const festivalMatchingSlice = createSlice({
  name: 'festivalMatching',
  initialState,
  reducers: {
    setSelectedPlaylistArtists: (state, action: PayloadAction<Artist[]>) => {
      state.selectedPlaylistArtists = action.payload;
    },
    addFestivalMatches: (state, action: PayloadAction<FestivalMatch[]>) => {
      state.festivalMatches = action.payload;
    },
    setPopularArtists: (state, action: PayloadAction<PopularArtistsDict>) => {
      state.popularArtists = action.payload;
    },
    addCountries: (state, action: PayloadAction<Area[]>) => {
      state.countries = action.payload;
    },
    addContinents: (state, action: PayloadAction<Area[]>) => {
      state.continents = action.payload;
    },
    setMatchSettings: (state, action: PayloadAction<MatchSettings>) => {
      state.matchSettings = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setSelectedPlaylistArtists,
  addFestivalMatches,
  setPopularArtists,
  addCountries,
  addContinents,
  setMatchSettings,
  setCurrentPage,
} = festivalMatchingSlice.actions;

export const selectSelectedPlaylistArtists = (state: RootState) =>
  state.festivalMatching.selectedPlaylistArtists;
export const selectFestivalMatches = (state: RootState) =>
  state.festivalMatching.festivalMatches;
export const selectPopularArtists = (state: RootState) =>
  state.festivalMatching.popularArtists;
export const selectCountries = (state: RootState) =>
  state.festivalMatching.countries;
export const selectContinents = (state: RootState) =>
  state.festivalMatching.continents;
export const selectMatchSettings = (state: RootState) =>
  state.festivalMatching.matchSettings;
export const selectCurrentPage = (state: RootState) =>
  state.festivalMatching.currentPage;

export default festivalMatchingSlice.reducer;
