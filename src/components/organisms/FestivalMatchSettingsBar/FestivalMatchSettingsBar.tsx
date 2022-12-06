import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { indigo } from '@mui/material/colors';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { Fragment } from 'react';
import { Area, Artist, MatchSettings, Playlist } from '../../../api/types';
import HtmlTooltip from '../../atoms/HtmlTooltip/HtmlTooltip';
import AreaSelect from '../../molecules/AreaSelect/AreaSelect';
import MatchCriteriaSelect from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import SettingsBarDatePicker from '../../molecules/SettingsBarDatePicker/SettingsBarDatePicker';

interface FestivalMatchSettingsBarProps {
  playlists: Playlist[];
  topArtists: Artist[];
  countries: Area[];
  continents: Area[];
  matchSettings: MatchSettings;
  onChangeHandlers: {
    onMatchBasisChange: (event: SelectChangeEvent) => Promise<void>;
    onAreaChange: (event: SelectChangeEvent) => Promise<void>;
    onFromDateChange: (date: Date | null) => void;
    onToDateChange: (date: Date | null) => void;
  };
  isMatchBasisFieldDisabled?: boolean;
}

const FestivalMatchSettingsBar = ({
  playlists,
  topArtists,
  countries,
  continents,
  matchSettings,
  onChangeHandlers: {
    onMatchBasisChange,
    onAreaChange,
    onFromDateChange,
    onToDateChange,
  },
  isMatchBasisFieldDisabled,
}: FestivalMatchSettingsBarProps) => {
  const themeMode = useTheme().palette.mode;
  const pcScreen = useMediaQuery('(min-width:1200px)');

  return (
    <Paper
      sx={{
        width: '100%',
        '@media (min-width: 800px)': {
          maxWidth: '1000px',
          justifyContent: 'space-between',
        },
        '@media (max-width: 799px)': {
          maxWidth: '460px',
        },
        mb: 2,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        '@media (min-width: 1000px)': { pt: 0.5, px: 2 },
        '@media (max-width: 999px)': { pt: 0.5, px: 0.5 },
      }}
    >
      <StyledBox>
        <FormControl
          sx={{
            m: 1,
            '@media (min-width: 800px)': { minWidth: 150, maxWidth: 220 },
            '@media (max-width: 799px)': { width: '100%' },
          }}
          size="small"
        >
          <InputLabel id="choose-playlist-label">Match with</InputLabel>
          <MatchCriteriaSelect
            value={matchSettings.matchBasis}
            onChange={onMatchBasisChange}
            label="Match with"
            topArtists={topArtists}
            playlists={playlists}
            disabled={isMatchBasisFieldDisabled}
          />
        </FormControl>
      </StyledBox>
      <StyledBox>
        <FormControl
          sx={{
            m: 1,
            '@media (min-width: 800px)': { minWidth: 150, maxWidth: 180 },
            '@media (max-width: 799px)': { width: '100%' },
          }}
          size="small"
        >
          <InputLabel id="choose-countries-label">Area</InputLabel>
          <AreaSelect
            continents={continents}
            countries={countries}
            value={matchSettings.area.isoCode}
            onChange={onAreaChange}
            label="Area"
          />
        </FormControl>
      </StyledBox>
      <StyledBox
        sx={{
          '@media (min-width: 800px)': { width: '316px' },
          justifyContent: 'center',
        }}
      >
        <Grid container justifyContent="space-around" sx={{ mb: 0.5 }}>
          <SettingsBarDatePicker
            label="From"
            value={matchSettings.fromDate}
            onChange={onFromDateChange}
          />
        </Grid>
        <Grid container justifyContent="space-around" sx={{ mb: 0.5 }}>
          <SettingsBarDatePicker
            label="To"
            value={matchSettings.toDate}
            onChange={onToDateChange}
          />
        </Grid>
      </StyledBox>
      {pcScreen && (
        <Box sx={{ pt: 0.5 }}>
          <HtmlTooltip
            placement="right-start"
            title={
              <Fragment>
                <Typography color="inherit" variant="h6">
                  Matching algorithm
                </Typography>
                {
                  'The matching algorithm is a combination of artist and genre matching. The number of artists in your selected playlist attending a festival combined with how well the genres of the playlist fit the festival, determines the match score shown on each festival.'
                }
              </Fragment>
            }
          >
            <InfoIcon
              color="primary"
              style={{
                fill: themeMode === 'light' ? indigo[500] : '#fcfcfe',
              }}
            />
          </HtmlTooltip>
        </Box>
      )}
    </Paper>
  );
};

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 799px)': { width: '100%' },
}));

export default FestivalMatchSettingsBar;
