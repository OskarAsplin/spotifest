import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Area } from '@src/api/types';
import { INITIAL_FROM_DATE, INITIAL_TO_DATE } from '@src/config';

type Store = {
  matchBasis?: string;
  matchArea?: Area;
  fromDate: string;
  toDate: string;
};

const INITIAL_STORE: Store = {
  fromDate: INITIAL_FROM_DATE.toISOString(),
  toDate: INITIAL_TO_DATE.toISOString(),
};

export const useMatchingStore = create<Store>()(
  persist(() => INITIAL_STORE, { name: 'matching-storage' }),
);

export const setMatchBasis = (matchBasis: string) =>
  useMatchingStore.setState({ matchBasis });
export const setMatchArea = (matchArea: Area) =>
  useMatchingStore.setState({ matchArea });

export const setDates = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => useMatchingStore.setState({ fromDate, toDate });

export const resetMathingStore = () =>
  useMatchingStore.setState(INITIAL_STORE, true);
