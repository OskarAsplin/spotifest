const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const EXPIRY_TIME_KEY = 'EXPIRY_TIME';
const SHARED_MATCH_BASIS_KEY = 'SHARED_MATCH_BASIS';

export const getStoredAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY);
export const setStoredAccessToken = (token: string) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const removeStoredAccessToken = () =>
  localStorage.removeItem(ACCESS_TOKEN_KEY);

export const getStoredExpiryTime = () => localStorage.getItem(EXPIRY_TIME_KEY);
export const setStoredExpiryTime = (expiryTime: string) =>
  localStorage.setItem(EXPIRY_TIME_KEY, expiryTime);
export const removeStoredExpiryTime = () =>
  localStorage.removeItem(EXPIRY_TIME_KEY);

export const getSharedMatchBasis = () =>
  localStorage.getItem(SHARED_MATCH_BASIS_KEY);
export const setSharedMatchBasis = (expiryTime: string) =>
  localStorage.setItem(SHARED_MATCH_BASIS_KEY, expiryTime);
export const removeSharedMatchBasis = () =>
  localStorage.removeItem(SHARED_MATCH_BASIS_KEY);
