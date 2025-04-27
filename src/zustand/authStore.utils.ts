export const isValidToken = (unixExpiryTime?: number) => {
  if (!unixExpiryTime) return false;

  const unixTimeNow = new Date().getTime(); // Unix time in milliseconds
  if (unixTimeNow < unixExpiryTime) return true;

  return false;
};
