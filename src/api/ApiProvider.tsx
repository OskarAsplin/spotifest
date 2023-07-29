import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryObserverOptions,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { useAuthStore } from '../zustand/authStore';

const DEFAULT_QUERY_OPTIONS: QueryObserverOptions = {
  gcTime: Infinity,
  staleTime: Infinity,
  suspense: true,
  refetchOnWindowFocus: false,
  retry: false,
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error.status === 401) useAuthStore.setState({ loggedIn: false });
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

const ApiProvider = ({ children }: ApiProviderProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
    {import.meta.env.VITE_REACT_QUERY_DEVTOOLS && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);

export default ApiProvider;
