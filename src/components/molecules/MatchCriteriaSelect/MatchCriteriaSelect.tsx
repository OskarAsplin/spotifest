import { MenuItem, Select, ListSubheader, SelectProps } from '@mui/material';
import { Artist, Playlist } from '../../../redux/types';
import { getPlaylistKey } from './MatchCriteriaSelect.utils';

export const TOP_ARTISTS_CHOICE = '__your__top__artists__';

interface MatchCriteriaSelectProps<T = string>
  extends Omit<SelectProps<T>, 'children'> {
  playlists: Playlist[];
  topArtists: Artist[];
}

const MatchCriteriaSelect = ({
  playlists,
  topArtists,
  ...selectProps
}: MatchCriteriaSelectProps) => {
  return (
    <Select {...selectProps}>
      {topArtists.length !== 0 && (
        <MenuItem key={TOP_ARTISTS_CHOICE} value={TOP_ARTISTS_CHOICE}>
          Your most played artists
        </MenuItem>
      )}
      {topArtists.length !== 0 && playlists.length !== 0 && (
        <ListSubheader disableSticky disableGutters>
          or choose a playlist below
        </ListSubheader>
      )}
      {playlists.map((playlist) => (
        <MenuItem
          key={getPlaylistKey(playlist)}
          value={getPlaylistKey(playlist)}
          style={{ minWidth: 200, maxWidth: 400 }}
        >
          {playlist.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MatchCriteriaSelect;
