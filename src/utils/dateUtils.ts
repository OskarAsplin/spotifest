import i18n from '../translations/i18n';

export const getLocalISODate = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dt = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${dt}`;
};

export const getCancelledDateString = (date: string, year?: number) => {
  const cancelledStr = i18n.t('translation:common.cancelled');
  if (!date) return cancelledStr;
  if (year) return `${cancelledStr} (${date}, ${year})`;
  return `${cancelledStr} (${date})`;
};
