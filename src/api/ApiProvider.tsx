import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryObserverOptions,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { setLoggedOff } from '../redux/reducers/authorizationSlice';

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const DEFAULT_QUERY_OPTIONS: QueryObserverOptions = {
  cacheTime: Infinity,
  staleTime: Infinity,
  suspense: true,
  refetchOnWindowFocus: false,
  retry: false,
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error.status === 401) store.dispatch(setLoggedOff());
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
    {process.env.REACT_APP_REACT_QUERY_DEVTOOLS && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);

export default ApiProvider;
