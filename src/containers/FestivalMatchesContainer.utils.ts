import { MatchCriteria, MatchRequest } from '../redux/types';
import { getLocalISODate } from '../utils/utils';
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
  dateFrom.setDate(1); // Frist day of month
  dateTo.setMonth(dateTo.getMonth() + 1, 0); // Last day of month
  return {
    artists: artists.map(mapToArtistMinimal),
    genres: artists.flatMap((artist) => artist.genres),
    numTracks: numTracks,
    isTopArtists: isTopArtists,
    dateFrom: getLocalISODate(dateFrom),
    dateTo: getLocalISODate(dateTo),
    continents: continents ?? [],
    countries: countries ?? [],
    states: states ?? [],
  };
};
