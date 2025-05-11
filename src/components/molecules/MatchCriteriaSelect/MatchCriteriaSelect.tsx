import { ListSubheader, MenuItem, Select, SelectProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Playlist } from '@src/api/types';

export const TOP_ARTISTS_CHOICE = '__your__top__artists__';
export const SAVED_TRACKS_CHOICE = '__your__saved__tracks__';

interface MatchCriteriaSelectProps<T = string>
  extends Omit<SelectProps<T>, 'children'> {
  playlists: Playlist[];
  hasTopArtists: boolean;
  hasSavedTracks: boolean;
}

const MatchCriteriaSelect = ({
  playlists,
  hasTopArtists,
  hasSavedTracks,
  ...selectProps
}: MatchCriteriaSelectProps) => {
  const { t } = useTranslation();

  return (
    <Select {...selectProps}>
      {hasTopArtists && (
        <MenuItem key={TOP_ARTISTS_CHOICE} value={TOP_ARTISTS_CHOICE}>
          {t('matching.criteria_select.top_artists_option')}
        </MenuItem>
      )}
      {hasSavedTracks && (
        <MenuItem key={SAVED_TRACKS_CHOICE} value={SAVED_TRACKS_CHOICE}>
          {t('matching.criteria_select.saved_tracks_option')}
        </MenuItem>
      )}
      {(hasTopArtists || hasSavedTracks) && playlists.length !== 0 && (
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
