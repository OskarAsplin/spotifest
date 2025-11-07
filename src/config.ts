import dayjs from 'dayjs';

const currentYear = dayjs().year();
const isAfterJuly = dayjs().month() >= 6; // July is month 6 (0-indexed)
const maxYear = isAfterJuly ? currentYear + 1 : currentYear;
const minYear = maxYear - 3;
export const MATCHING_MIN_DATE = dayjs(`${minYear}-01-01`);
export const MATCHING_MAX_DATE = dayjs(`${maxYear}-12-31`);
export const DATE_RANGE_YEAR_OPTIONS = [maxYear - 2, maxYear - 1, maxYear];

export const INITIAL_FROM_DATE = dayjs();
export const INITIAL_TO_DATE = MATCHING_MAX_DATE;
