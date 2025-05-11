import { Artist } from '@src/api/types';
import Stromae_Spotify_Img from '@src/storyAssets/stromae_spotify.jpeg';

export const artistMock: Artist = {
  name: 'Stromae',
  spotifyId: '5j4HeCoUlzhfWtjAfM1acR',
  iconPicture: Stromae_Spotify_Img,
  popularity: 1337,
  genres: ['belgian pop', 'g-house'],
};
