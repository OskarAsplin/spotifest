import { Playlist } from '@src/api/types';

export const playlistMock: Playlist = {
  name: 'Funky tunes',
  id: 'abc123',
  images: [],
  ownerId: 'oskarito',
  numTracks: 1337,
  spotifyUrl: '',
  isPublic: true,
};

export const playlistMock2: Playlist = {
  ...playlistMock,
  name: 'Groovy tunes',
  id: 'def456',
};
