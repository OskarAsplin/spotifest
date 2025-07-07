import { useTranslation } from 'react-i18next';
import { Playlist } from '@src/api/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@src/components/ui/select';
import { cn } from '@src/lib/utils';
import { HtmlTooltip } from '@src/components/atoms/HtmlTooltip/HtmlTooltip';

export const TOP_ARTISTS_CHOICE = '__your__top__artists__';
export const SAVED_TRACKS_CHOICE = '__your__saved__tracks__';

interface MatchCriteriaSelectProps {
  playlists: Playlist[];
  hasTopArtists: boolean;
  hasSavedTracks: boolean;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  alignContent?: 'start' | 'center' | 'end';
}

export const MatchCriteriaSelect = ({
  playlists,
  hasTopArtists,
  hasSavedTracks,
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
  size = 'default',
  alignContent,
}: MatchCriteriaSelectProps) => {
  const { t } = useTranslation();

  return (
    <HtmlTooltip
      title={disabled ? t('matching.criteria_select.click_link') : undefined}
    >
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={cn('w-full max-w-[400px] min-w-[200px]', className)}
          size={size}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-w-[min(90vw,400px)]" align={alignContent}>
          {hasTopArtists && (
            <SelectItem key={TOP_ARTISTS_CHOICE} value={TOP_ARTISTS_CHOICE}>
              {t('matching.criteria_select.top_artists_option')}
            </SelectItem>
          )}
          {hasSavedTracks && (
            <SelectItem key={SAVED_TRACKS_CHOICE} value={SAVED_TRACKS_CHOICE}>
              {t('matching.criteria_select.saved_tracks_option')}
            </SelectItem>
          )}
          {(hasTopArtists || hasSavedTracks) && playlists.length !== 0 && (
            <SelectGroup>
              <SelectLabel>
                {t('matching.criteria_select.playlists_sub_header')}
              </SelectLabel>
              {playlists.map((playlist) => (
                <SelectItem
                  key={playlist.id}
                  value={playlist.id}
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {playlist.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {!(hasTopArtists || hasSavedTracks) && playlists.length !== 0 && (
            <>
              {playlists.map((playlist) => (
                <SelectItem
                  key={playlist.id}
                  value={playlist.id}
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {playlist.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </HtmlTooltip>
  );
};
