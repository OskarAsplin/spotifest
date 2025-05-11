import {
  DefaultOptions,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { resetAuthStore } from '@src/zustand/authStore';

const DEFAULT_QUERY_OPTIONS: DefaultOptions['queries'] = {
  gcTime: Infinity,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  retry: false,
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error.status === 401) resetAuthStore();
    },
  }),
});
queryClient.setDefaultOptions({
  queries: DEFAULT_QUERY_OPTIONS,
  mutations: { retry: DEFAULT_QUERY_OPTIONS.retry },
});

interface ApiProviderProps {
  children?: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
    {import.meta.env.VITE_REACT_QUERY_DEVTOOLS === 'true' && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);
