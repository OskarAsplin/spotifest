import { Dialog, DialogContent } from '@src/components/ui/dialog';
import { Trans, useTranslation } from 'react-i18next';
import { Playlist } from '@src/api/types';
import { StandardLink } from '@src/components/atoms/StandardLink/StandardLink';
import {
  MatchCriteriaSelect,
  SAVED_TRACKS_CHOICE,
  TOP_ARTISTS_CHOICE,
} from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { setMatchBasis } from '@src/zustand/matchingStore';
import { Button } from '@src/components/ui/button';

interface SelectPlaylistModalProps {
  open: boolean;
  playlists: Playlist[];
  hasTopArtists: boolean;
  hasSavedTracks: boolean;
  userSpotifyUrl?: string;
}

export const SelectPlaylistModal = ({
  open,
  playlists,
  hasTopArtists,
  hasSavedTracks,
  userSpotifyUrl,
}: SelectPlaylistModalProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={open ? 'absolute inset-0 z-50 backdrop-blur-xs' : undefined}
    >
      <Dialog open={open}>
        <DialogContent className="p-4 sm:p-6" showCloseButton={false}>
          {(playlists.length !== 0 || hasTopArtists) && (
            <div className="flex flex-col items-center">
              <h2 className="mt-2 mb-4 text-center text-xl font-semibold whitespace-pre-line max-[344px]:text-lg sm:text-2xl sm:font-bold">
                {t('matching.modal.title')}
              </h2>
              <span className="mb-2 text-center text-base font-semibold">
                {t('matching.modal.match_selector')}
              </span>
              <div className="m-1 flex max-w-[220px] min-w-[150px] flex-col gap-3 md:max-w-[300px] md:min-w-[200px]">
                {hasTopArtists && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setMatchBasis(TOP_ARTISTS_CHOICE)}
                    size="lg"
                  >
                    {t('matching.criteria_select.top_artists_option')}
                  </Button>
                )}
                {hasSavedTracks && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setMatchBasis(SAVED_TRACKS_CHOICE)}
                    size="lg"
                  >
                    {t('matching.criteria_select.saved_tracks_option')}
                  </Button>
                )}
                <MatchCriteriaSelect
                  placeholder="Or select a playlist"
                  onValueChange={setMatchBasis}
                  hasTopArtists={false}
                  hasSavedTracks={false}
                  playlists={playlists}
                  className="[&>span]:mx-auto"
                  size="lg"
                  alignContent="center"
                />
              </div>
            </div>
          )}
          {!hasTopArtists && playlists.length === 0 && (
            <p>
              <Trans
                i18nKey="matching.modal.no_top_artists_or_playlists"
                components={{ Link: <StandardLink href={userSpotifyUrl} /> }}
              />
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
