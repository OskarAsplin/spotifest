import { QueryKey, useQuery } from '@tanstack/react-query';
import { ComponentType, forwardRef, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { uniqueFunctionId } from './uniqueFunctionId';
import { OpBaseType, OpReturn, Params, UseApiQueryProps } from './api.types';

const errorBoundary = (error: any) =>
  error instanceof TypeError ||
  error.response?.status >= 500 ||
  (typeof error.status === 'number' && error.status >= 500);

const getKey = <Op extends OpBaseType>(
  operation: Op,
  params?: Params<Op>,
): QueryKey =>
  params
    ? [uniqueFunctionId(operation), params]
    : [uniqueFunctionId(operation)];

export const useApiQuery = <
  Op extends OpBaseType,
  TQueryFnData = OpReturn<Op>,
  TError = unknown,
  TData = TQueryFnData,
>(
  operation: Op,
  {
    params = {},
    ...options
  }: UseApiQueryProps<Op, TQueryFnData, TError, TData> = {},
) =>
  useQuery({
    queryKey: getKey(operation, params),
    queryFn: () => operation(params),
    useErrorBoundary: errorBoundary,
    ...options,
  });

export const withFallback = <Props extends object>(
  SuspenseFallback?: ComponentType<Props>,
  ErrorFallback: ComponentType<FallbackProps> = () => null,
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
