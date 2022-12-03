export const getLocalISODate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dt = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${dt}`;
};
