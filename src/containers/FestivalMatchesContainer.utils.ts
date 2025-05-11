import { mapToArtistMinimal } from '@src/api/mappers';
import { MatchCriteria, MatchRequest } from '@src/api/types';
import { getLocalISODate } from '@src/utils/dateUtils';

export const createMatchRequest = ({
  artists,
  weight,
  isTopArtists = false,
  dateFrom,
  dateTo,
  continents = [],
  countries = [],
  states = [],
}: MatchCriteria): MatchRequest => {
  dateFrom.setDate(1); // Frist day of month
  dateTo.setMonth(dateTo.getMonth() + 1, 0); // Last day of month
  return {
    artists: artists.map(mapToArtistMinimal),
    genres: artists.flatMap((artist) => artist.genres),
    numTracks: weight,
    isTopArtists,
    dateFrom: getLocalISODate(dateFrom),
    dateTo: getLocalISODate(dateTo),
    continents,
    countries,
    states,
  };
};
