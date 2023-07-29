import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Area } from '../api/types';
import { INITIAL_FROM_DATE, INITIAL_TO_DATE } from '../config';

interface MatchingStore {
  matchBasis?: string;
  matchArea?: Area;
  fromDate: string;
  toDate: string;
  setMatchBasis: (matchBasis: string) => void;
  setMatchArea: (matchArea: Area) => void;
  setFromDate: (fromDate: string) => void;
  setToDate: (toDate: string) => void;
  setDates: (dates: { fromDate: string; toDate: string }) => void;
  clearStore: () => void;
}

export const useMatchingStore = create<MatchingStore, any>(
  persist(
    (set) => ({
      fromDate: INITIAL_FROM_DATE.toISOString(),
      toDate: INITIAL_TO_DATE.toISOString(),
      setMatchBasis: (matchBasis) => set({ matchBasis }),
      setMatchArea: (matchArea) => set({ matchArea }),
      setFromDate: (fromDate) => set({ fromDate }),
      setToDate: (toDate) => set({ toDate }),
      setDates: ({ fromDate, toDate }) => set({ fromDate, toDate }),
      clearStore: () => set({}, true),
    }),
    { name: 'matching-storage' },
  ),
);
