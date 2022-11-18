import { ComponentType, Suspense, forwardRef } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setLoggedOff } from '../../redux/reducers/authorizationSlice';
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
        error instanceof TypeError || error.response?.status >= 500,
      onError: (error: any) => {
        if (error.status === 401) dispatch(setLoggedOff());
        onError?.(error);
      },
      ...queryConfig,
    }
  );
};

export function withFallback<Props extends object>(
  Fallback?: ComponentType<Props>,
  Error: ComponentType<FallbackProps> = () => null
) {
  return (Component: ComponentType<Props>) =>
    // eslint-disable-next-line react/display-name
    forwardRef((props: Props, ref) => (
      <ErrorBoundary FallbackComponent={Error}>
        <Suspense fallback={Fallback ? <Fallback {...props} /> : false}>
          <Component ref={ref} {...props} />
        </Suspense>
      </ErrorBoundary>
    ));
}
