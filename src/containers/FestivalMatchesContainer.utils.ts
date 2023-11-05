import { mapToArtistMinimal } from '../api/mappers';
import { MatchCriteria, MatchRequest } from '../api/types';
import { getLocalISODate } from '../utils/dateUtils';

export const createMatchRequest = ({
  artists,
  numTracks,
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
    numTracks,
    isTopArtists,
    dateFrom: getLocalISODate(dateFrom),
    dateTo: getLocalISODate(dateTo),
    continents,
    countries,
    states,
  };
};
