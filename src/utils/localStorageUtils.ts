const SHARED_MATCH_BASIS_KEY = 'SHARED_MATCH_BASIS';

export const getSharedMatchBasis = () =>
  localStorage.getItem(SHARED_MATCH_BASIS_KEY);
export const setSharedMatchBasis = (expiryTime: string) =>
  localStorage.setItem(SHARED_MATCH_BASIS_KEY, expiryTime);
export const removeSharedMatchBasis = () =>
  localStorage.removeItem(SHARED_MATCH_BASIS_KEY);
