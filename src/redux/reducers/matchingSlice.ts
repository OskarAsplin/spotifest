import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Area } from '../types';
import { INITIAL_FROM_DATE, INITIAL_TO_DATE } from '../../config';

interface matchingState {
  matchBasis?: string;
  matchArea?: Area;
  fromDate: string;
  toDate: string;
}

const initialState: matchingState = {
  fromDate: INITIAL_FROM_DATE.toISOString(),
  toDate: INITIAL_TO_DATE.toISOString(),
};

export const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    setMatchBasis: (state, action: PayloadAction<string>) => {
      state.matchBasis = action.payload;
    },
    setMatchArea: (state, action: PayloadAction<Area>) => {
      state.matchArea = action.payload;
    },
    setFromDate: (state, action: PayloadAction<string>) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action: PayloadAction<string>) => {
      state.toDate = action.payload;
    },
    setDates: (
      state,
      action: PayloadAction<{ fromDate: string; toDate: string }>
    ) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
    },
  },
});

export const { setMatchBasis, setMatchArea, setFromDate, setToDate, setDates } =
  matchingSlice.actions;

export const selectMatchBasis = (state: RootState) => state.matching.matchBasis;
export const selectMatchArea = (state: RootState) => state.matching.matchArea;
export const selectFromDate = (state: RootState) => state.matching.fromDate;
export const selectToDate = (state: RootState) => state.matching.toDate;

export default matchingSlice.reducer;
