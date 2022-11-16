import { Artist, ArtistMinimal } from '../redux/types';

export const mapToArtistMinimal = (artist: Artist): ArtistMinimal => ({
  spotifyId: artist.spotifyId,
  userPopularity: artist.userPopularity,
});
