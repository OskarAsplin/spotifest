import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Area } from '../api/types';
import { INITIAL_FROM_DATE, INITIAL_TO_DATE } from '../config';

interface MatchingStore {
  matchBasis?: string;
  matchArea?: Area;
  fromDate: string;
  toDate: string;
}

const INITIAL_STORE: MatchingStore = {
  fromDate: INITIAL_FROM_DATE.toISOString(),
  toDate: INITIAL_TO_DATE.toISOString(),
};

export const useMatchingStore = create<MatchingStore, any>(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set) => INITIAL_STORE,
    { name: 'matching-storage' },
  ),
);

export const setMatchBasis = (matchBasis: string) =>
  useMatchingStore.setState({ matchBasis });
export const setMatchArea = (matchArea: Area) =>
  useMatchingStore.setState({ matchArea });
export const setFromDate = (fromDate: string) =>
  useMatchingStore.setState({ fromDate });
export const setToDate = (toDate: string) =>
  useMatchingStore.setState({ toDate });

export const setDates = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => useMatchingStore.setState({ fromDate, toDate });

export const resetMathingStore = () =>
  useMatchingStore.setState(INITIAL_STORE, true);
