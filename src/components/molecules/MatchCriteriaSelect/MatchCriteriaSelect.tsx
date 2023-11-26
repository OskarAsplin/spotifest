import { ListSubheader, MenuItem, Select, SelectProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Artist, Playlist } from '../../../api/types';

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
  const { t } = useTranslation();
  return (
    <Select {...selectProps}>
      {topArtists.length !== 0 && (
        <MenuItem key={TOP_ARTISTS_CHOICE} value={TOP_ARTISTS_CHOICE}>
          {t('matching.criteria_select.top_artists_option')}
        </MenuItem>
      )}
      {topArtists.length !== 0 && playlists.length !== 0 && (
        <ListSubheader disableSticky disableGutters>
          {t('matching.criteria_select.playlists_sub_header')}
        </ListSubheader>
      )}
      {playlists.map((playlist) => (
        <MenuItem
          key={playlist.id}
          value={playlist.id}
          style={{ minWidth: 200, maxWidth: 400 }}
        >
          {playlist.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MatchCriteriaSelect;
