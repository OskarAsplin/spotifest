import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ComponentType, forwardRef, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useDispatch } from 'react-redux';
import { setLoggedOff } from '../redux/reducers/authorizationSlice';
import { uniqueFunctionId } from './uniqueFunctionId';

type OpBaseType<R = any> = (...args: any) => Promise<R>;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

interface UseGetProps<Op extends OpBaseType>
  extends Omit<UseQueryOptions<ThenArg<ReturnType<Op>>>, 'useErrorBoundary'> {
  query?: Parameters<Op>[0];
}

export const useGet = <Op extends OpBaseType>(
  operation: Op,
  { query = {}, onError, ...queryConfig }: UseGetProps<Op> = {}
) => {
  const dispatch = useDispatch();

  return useQuery<ThenArg<ReturnType<Op>>>(
    [uniqueFunctionId(operation), query],
    () => operation(query),
    {
      useErrorBoundary: (error: any) =>
        error instanceof TypeError ||
        error.response?.status >= 500 ||
        (typeof error.status === 'number' && error.status >= 500),
      onError: (error: any) => {
        if (error.status === 401) dispatch(setLoggedOff());
        onError?.(error);
        console.log(error);
      },
      ...queryConfig,
    }
  );
};

export const withFallback = <Props extends object>(
  SuspenseFallback?: ComponentType<Props>,
  ErrorFallback: ComponentType<FallbackProps> = () => null
) => {
  return (Component: ComponentType<Props>) =>
    forwardRef((props: Props, ref) => (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense
          fallback={SuspenseFallback ? <SuspenseFallback {...props} /> : false}
        >
          <Component ref={ref} {...props} />
        </Suspense>
      </ErrorBoundary>
    ));
};
