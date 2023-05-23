import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ComponentType, forwardRef, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { uniqueFunctionId } from './uniqueFunctionId';

type OpBaseType<R = any> = (...args: any) => Promise<R>;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

interface UseApiQueryProps<Op extends OpBaseType>
  extends Omit<UseQueryOptions<ThenArg<ReturnType<Op>>>, 'useErrorBoundary'> {
  query?: Parameters<Op>[0];
}

export const useApiQuery = <Op extends OpBaseType>(
  operation: Op,
  { query = {}, ...queryConfig }: UseApiQueryProps<Op> = {}
) =>
  useQuery<ThenArg<ReturnType<Op>>>(
    [uniqueFunctionId(operation), query],
    () => operation(query),
    {
      useErrorBoundary: (error: any) =>
        error instanceof TypeError ||
        error.response?.status >= 500 ||
        (typeof error.status === 'number' && error.status >= 500),
      ...queryConfig,
    }
  );

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
