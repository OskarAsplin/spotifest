export const MATCHING_MIN_DATE = new Date(2021, 0, 1);
export const MATCHING_MAX_DATE = new Date(2022, 11, 31);

export const INITIAL_FROM_DATE = new Date(2022, 0, 1);
export const INITIAL_TO_DATE = new Date(2022, 11, 31);

/*
--- OLD DATE logic ---
export const MATCHING_MIN_DATE = new Date(new Date().getFullYear() + 1, 11, 31);
export const MATCHING_MAX_DATE = new Date(new Date().getFullYear(), 0, 1);

const afterApril: boolean =
  new Date() >= new Date(new Date().getFullYear(), 4, 30);
const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
oneYearFromNow.setUTCHours(0);
const endOfNextYear = new Date(new Date().getFullYear() + 1, 11, 31);
endOfNextYear.setUTCDate(31);
endOfNextYear.setUTCHours(0);
const initialToDate = afterApril ? endOfNextYear : oneYearFromNow;
const initialFromDate = new Date()
*/
