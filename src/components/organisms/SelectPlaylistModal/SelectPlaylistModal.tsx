import {
  Box,
  Button,
  Fade,
  FormControl,
  InputLabel,
  Modal,
  Paper,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Trans, useTranslation } from 'react-i18next';
import { Playlist } from '../../../api/types';
import { StandardLink } from '../../atoms/StandardLink/StandardLink';
import MatchCriteriaSelect, {
  TOP_ARTISTS_CHOICE,
} from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { setMatchBasis } from '../../../zustand/matchingStore';

interface SelectPlaylistModalProps {
  open: boolean;
  onClickGoButton: () => void;
  playlists: Playlist[];
  hasTopArtists: boolean;
  hasSavedTracks: boolean;
  userSpotifyUrl?: string;
}

const SelectPlaylistModal = ({
  open,
  onClickGoButton,
  playlists,
  hasTopArtists,
  hasSavedTracks,
  userSpotifyUrl,
}: SelectPlaylistModalProps) => {
  const smallScreen = useMediaQuery('(max-width:610px)');
  const { t } = useTranslation();

  const onMatchBasisChange = (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    setMatchBasis(event.target.value);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      slotProps={{ backdrop: { timeout: 500 } }}
      open={open}
      disableEscapeKeyDown
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
      }}
    >
      <Fade in={open}>
        <Paper sx={{ p: 2, outline: 'none', backgroundColor: '#303030' }}>
          {(playlists.length !== 0 || hasTopArtists) && (
            <StyledBox sx={{ flexDirection: 'column' }}>
              <Typography
                variant={smallScreen ? (hasTopArtists ? 'h5' : 'h6') : 'h4'}
                sx={{ textAlign: 'center', mb: 1 }}
              >
                {hasTopArtists
                  ? t('matching.modal.default_text')
                  : t('matching.modal.no_top_artists')}
              </Typography>
              <FormControl
                sx={{
                  m: 1,
                  '@media (min-width: 800px)': { minWidth: 200, maxWidth: 300 },
                  '@media (max-width: 799px)': { minWidth: 150, maxWidth: 220 },
                }}
                size="small"
              >
                {!hasTopArtists && (
                  <InputLabel id="choose-initial-playlist-inputlabel">
                    {t('common.playlist')}
                  </InputLabel>
                )}
                <MatchCriteriaSelect
                  value={hasTopArtists ? TOP_ARTISTS_CHOICE : ''}
                  label={!hasTopArtists ? t('common.playlist') : undefined}
                  onChange={onMatchBasisChange}
                  hasTopArtists={hasTopArtists}
                  hasSavedTracks={hasSavedTracks}
                  playlists={playlists}
                />
              </FormControl>
            </StyledBox>
          )}
          {hasTopArtists && (
            <StyledBox sx={{ flexDirection: 'column' }}>
              <Button
                color="primary"
                size="large"
                variant="outlined"
                sx={{ mt: 3, mb: 1 }}
                onClick={onClickGoButton}
              >
                <Typography
                  variant={smallScreen ? 'h6' : 'h4'}
                  sx={{ fontWeight: 'bold' }}
                >
                  {t('matching.modal.go_button')}
                </Typography>
              </Button>
            </StyledBox>
          )}
          {!hasTopArtists && playlists.length === 0 && (
            <Typography>
              <Trans
                i18nKey="matching.modal.no_top_artists_or_playlists"
                components={{ Link: <StandardLink href={userSpotifyUrl} /> }}
              />
            </Typography>
          )}
        </Paper>
      </Fade>
    </Modal>
  );
};

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 799px)': { width: '100%' },
}));

export default SelectPlaylistModal;
