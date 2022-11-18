import { MatchCriteria, MatchRequest } from '../redux/types';
import { getShortDateISOString } from '../utils/utils';
import { mapToArtistMinimal } from '../utils/mappers';

export const createMatchRequest = ({
  artists,
  numTracks,
  isTopArtists,
  dateFrom,
  dateTo,
  continents,
  countries,
  states,
}: MatchCriteria): MatchRequest => {
  dateFrom.setUTCHours(0);
  dateFrom.setDate(1); // Frist day of month
  dateTo.setUTCHours(0);
  dateTo.setMonth(dateTo.getMonth() + 1, 0); // Last day of month
  return {
    artists: artists.map(mapToArtistMinimal),
    genres: artists.flatMap((artist) => artist.genres),
    numTracks: numTracks,
    isTopArtists: isTopArtists,
    dateFrom: getShortDateISOString(dateFrom),
    dateTo: getShortDateISOString(dateTo),
    continents: continents ?? [],
    countries: countries ?? [],
    states: states ?? [],
  };
};
