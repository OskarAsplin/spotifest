import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Area } from '../api/types';
import { INITIAL_FROM_DATE, INITIAL_TO_DATE } from '../config';

type Store = {
  page: number;
  matchBasis?: string;
  matchArea?: Area;
  fromDate: string;
  toDate: string;
};

const INITIAL_STORE: Store = {
  page: 1,
  fromDate: INITIAL_FROM_DATE.toISOString(),
  toDate: INITIAL_TO_DATE.toISOString(),
};

export const useMatchingStore = create<Store>()(
  persist(() => INITIAL_STORE, { name: 'matching-storage' }),
);

export const setPage = (page: number) => useMatchingStore.setState({ page });
export const setMatchBasis = (matchBasis: string) =>
  useMatchingStore.setState({ matchBasis, page: 1 });
export const setMatchArea = (matchArea: Area) =>
  useMatchingStore.setState({ matchArea, page: 1 });

export const setDates = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => useMatchingStore.setState({ fromDate, toDate, page: 1 });

export const resetMathingStore = () =>
  useMatchingStore.setState(INITIAL_STORE, true);
