import { UseQueryOptions } from '@tanstack/react-query';

export type OpBaseType<R = any> = (...args: any) => Promise<R>;
export type Params<Op extends OpBaseType> = Parameters<Op>[0];
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type OpReturn<Op extends OpBaseType> = ThenArg<ReturnType<Op>>;

export interface UseApiQueryProps<
  Op extends OpBaseType,
  TQueryFnData = OpReturn<Op>,
  TError = unknown,
  TData = TQueryFnData,
> extends Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> {
  params?: Params<Op>;
}
