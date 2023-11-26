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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { Trans, useTranslation } from 'react-i18next';
import { Artist, Playlist } from '../../../api/types';
import StandardLink from '../../atoms/StandardLink/StandardLink';
import MatchCriteriaSelect, {
  TOP_ARTISTS_CHOICE,
} from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect';

interface SelectPlaylistModalProps {
  open: boolean;
  onMatchBasisChange: (event: SelectChangeEvent) => Promise<void>;
  onClickGoButton: () => void;
  playlists: Playlist[];
  topArtists: Artist[];
  savedTracksArtists: Artist[];
  userSpotifyUrl?: string;
}

const SelectPlaylistModal = ({
  open,
  onMatchBasisChange,
  onClickGoButton,
  playlists,
  topArtists,
  savedTracksArtists,
  userSpotifyUrl,
}: SelectPlaylistModalProps) => {
  const smallScreen = useMediaQuery('(max-width:610px)');
  const { t } = useTranslation();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      BackdropProps={{ timeout: 500 }}
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
          {(playlists.length !== 0 || topArtists.length !== 0) && (
            <StyledBox sx={{ flexDirection: 'column' }}>
              <Typography
                variant={
                  smallScreen ? (topArtists.length === 0 ? 'h6' : 'h5') : 'h4'
                }
                sx={{ textAlign: 'center', mb: 1 }}
              >
                {topArtists.length === 0
                  ? t('matching.modal.no_top_artists')
                  : t('matching.modal.default_text')}
              </Typography>
              <FormControl
                sx={{
                  m: 1,
                  '@media (min-width: 800px)': { minWidth: 200, maxWidth: 300 },
                  '@media (max-width: 799px)': { minWidth: 150, maxWidth: 220 },
                }}
                size="small"
              >
                {topArtists.length === 0 && (
                  <InputLabel id="choose-initial-playlist-inputlabel">
                    {t('common.playlist')}
                  </InputLabel>
                )}
                <MatchCriteriaSelect
                  value={topArtists.length !== 0 ? TOP_ARTISTS_CHOICE : ''}
                  label={
                    topArtists.length === 0 ? t('common.playlist') : undefined
                  }
                  onChange={onMatchBasisChange}
                  topArtists={topArtists}
                  savedTracksArtists={savedTracksArtists}
                  playlists={playlists}
                />
              </FormControl>
            </StyledBox>
          )}
          {topArtists.length !== 0 && (
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
          {topArtists.length === 0 && playlists.length === 0 && (
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
