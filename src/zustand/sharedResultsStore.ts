import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = { matchBasis?: string };

const INITIAL_STORE: Store = {};

const useSharedResultsStore = create<Store>()(
  persist(() => INITIAL_STORE, { name: 'shared-results-storage' }),
);

export const useSharedMatchBasis = () =>
  useSharedResultsStore((state) => state.matchBasis);

export const setSharedMatchBasis = (matchBasis: string) =>
  useSharedResultsStore.setState({ matchBasis });
