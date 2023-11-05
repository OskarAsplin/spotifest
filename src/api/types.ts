export interface MinimalUserInfo {
  displayName?: string;
  profilePictureUrl?: string;
  spotifyUrl: string;
  id: string;
}

export interface UserInfo extends MinimalUserInfo {
  country: string;
}

export interface Playlist {
  name: string;
  id: string;
  images: string[];
  ownerId: string;
  numTracks: number;
  spotifyUrl: string;
  isPublic: boolean;
}

export interface Artist {
  name: string;
  spotifyId?: string;
  iconPicture?: string;
  bigPicture?: string;
  popularity: number;
  userPopularity?: number;
  genres: string[];
}

export interface ArtistMinimal {
  spotifyId?: string;
  userPopularity?: number;
}

export interface PopularArtistsDict {
  [id: string]: Artist[];
}

export interface MatchRequest {
  artists: ArtistMinimal[];
  genres: string[];
  numTracks: number;
  isTopArtists: boolean;
  dateFrom: string;
  dateTo: string;
  continents: string[];
  countries: string[];
  states: string[];
}

export interface MatchCriteria {
  artists: Artist[];
  numTracks: number;
  isTopArtists?: boolean;
  dateFrom: Date;
  dateTo: Date;
  continents?: string[];
  countries?: string[];
  states?: string[];
}

export interface FestivalMatch {
  lineup_id: string;
  name: string;
  locationText: string;
  country: string;
  date: string;
  year: number;
  cancelled: boolean;
  matching_percent_artists: number;
  matching_artists: string[];
  matching_percent_genres: number;
  matching_percent_combined: number;
  top_genres: string;
}

interface Lineup {
  festival: string;
  year: number;
  from_date_iso: string;
  to_date_iso: string;
  date_str: string;
  cancelled: boolean;
  artists: Artist[];
}

export interface FestivalInfo {
  name: string;
  locationText: string;
  country: string;
  genres: string[];
  webpage: string;
  ticketWebpage: string;
  crawledWebpage: string;
  video: string;
  lineups: Lineup[];
}

interface FestivalMatchExtended extends FestivalMatch {
  popular_artists: Artist[];
}

export interface ArtistInfo {
  artist: Artist;
  festivalsFuture: FestivalMatchExtended[];
  festivalsPast: FestivalMatchExtended[];
}

export interface Area {
  name: string;
  isoCode: string;
}

export interface MatchSettings {
  matchBasis: string;
  area: Area;
  fromDate: string;
  toDate: string;
  numTracks: number;
}

export interface SearchResponse {
  festivals: { name: string; location: string; country: string }[];
  artists: { name: string; spotifyId?: string }[];
}
