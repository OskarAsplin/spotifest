import { ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryObserverOptions,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Default React Query config, we don't want endless loops on errors
export const DEFAULT_QUERY_OPTIONS: QueryObserverOptions = {
  cacheTime: Infinity,
  staleTime: Infinity,
  suspense: true,
  refetchOnWindowFocus: false,
  retry: false,
};

export const queryClient = new QueryClient();
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
    {process.env.REACT_APP_REACT_QUERY_DEVTOOLS && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);

export default ApiProvider;
