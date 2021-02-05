import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Artist, FestivalMatch, PopularArtistsDict, MatchingMethod, Area, MatchSettings } from "../types";

interface FestivalMatchingState {
    selectedPlaylistArtists: Artist[];
    festivalMatches: FestivalMatch[];
    popularArtists: PopularArtistsDict;
    matchingMethod: MatchingMethod;
    countries: Area[];
    continents: Area[];
    matchSettings: MatchSettings;
    currentPage: number;
}

const afterApril: boolean = new Date() >= new Date(new Date().getFullYear(), 4, 30);
const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
oneYearFromNow.setUTCHours(0);
const endOfNextYear = new Date(new Date().getFullYear() + 1, 11, 31);
endOfNextYear.setUTCDate(31);
endOfNextYear.setUTCHours(0);
const initialToDate = afterApril ? endOfNextYear : oneYearFromNow;

const initialState: FestivalMatchingState = {
    selectedPlaylistArtists: [],
    festivalMatches: [],
    popularArtists: {},
    matchingMethod: MatchingMethod.Genre,
    countries: [],
    continents: [],
    matchSettings: {
        matchBasis: '',
        area: { name: 'Worldwide', isoCode: 'XXX' },
        fromDate: (new Date()).toISOString(),
        toDate: initialToDate.toISOString(),
        numTracks: 0,
    },
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
        setMatchingMethod: (state, action: PayloadAction<MatchingMethod>) => {
            state.matchingMethod = action.payload;
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
    setMatchingMethod,
    addCountries,
    addContinents,
    setMatchSettings,
    setCurrentPage,
} = festivalMatchingSlice.actions;

export const selectSelectedPlaylistArtists = (state: RootState) => state.festivalMatching.selectedPlaylistArtists;
export const selectFestivalMatches = (state: RootState) => state.festivalMatching.festivalMatches;
export const selectPopularArtists = (state: RootState) => state.festivalMatching.popularArtists;
export const selectMatchingMethod = (state: RootState) => state.festivalMatching.matchingMethod;
export const selectCountries = (state: RootState) => state.festivalMatching.countries;
export const selectContinents = (state: RootState) => state.festivalMatching.continents;
export const selectMatchSettings = (state: RootState) => state.festivalMatching.matchSettings;
export const selectCurrentPage = (state: RootState) => state.festivalMatching.currentPage;

export default festivalMatchingSlice.reducer;

