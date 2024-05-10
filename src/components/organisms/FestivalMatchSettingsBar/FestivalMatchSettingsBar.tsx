import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
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
import { useTranslation } from 'react-i18next';
import { Area, MatchSettings, Playlist } from '../../../api/types';
import HtmlTooltip from '../../atoms/HtmlTooltip/HtmlTooltip';
import AreaSelect from '../../molecules/AreaSelect/AreaSelect';
import MatchCriteriaSelect from '../../molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import SettingsBarDatePicker from '../../molecules/SettingsBarDatePicker/SettingsBarDatePicker';
import {
  setDates,
  setMatchArea,
  setMatchBasis,
  useMatchingStore,
} from '../../../zustand/matchingStore';
import { MATCHING_MAX_DATE } from '../../../config';

interface FestivalMatchSettingsBarProps {
  matchBasis?: string;
  playlists: Playlist[];
  hasTopArtists?: boolean;
  hasSavedTracks?: boolean;
  countries: Area[];
  continents: Area[];
  isMatchBasisFieldDisabled?: boolean;
}

const FestivalMatchSettingsBar = ({
  matchBasis,
  playlists,
  hasTopArtists = false,
  hasSavedTracks = false,
  countries,
  continents,
  isMatchBasisFieldDisabled,
}: FestivalMatchSettingsBarProps) => {
  const { t } = useTranslation();
  const themeMode = useTheme().palette.mode;
  const pcScreen = useMediaQuery('(min-width:1200px)');
  const showYearPreSelect = useMediaQuery('(max-width:799px)');

  const matchArea = useMatchingStore((state) => state.matchArea);
  const fromDate = useMatchingStore((state) => state.fromDate);
  const toDate = useMatchingStore((state) => state.toDate);

  const onMatchBasisChange = (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    setMatchBasis(event.target.value);
  };

  const onAreaChange = (event: SelectChangeEvent) => {
    if (!event.target.value) return;
    const { name, value } = event.target;
    const area: Area = { name, isoCode: value };
    setMatchArea(area);
  };

  const onFromDateChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString();
      if (date > new Date(toDate)) {
        setDates({ fromDate: isoDate, toDate: isoDate });
      } else {
        setDates({ fromDate: isoDate, toDate });
      }
    }
  };

  const onToDateChange = (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString();
      if (date < new Date(fromDate)) {
        setDates({ fromDate: isoDate, toDate: isoDate });
      } else {
        setDates({ fromDate, toDate: isoDate });
      }
    }
  };

  const onDateRangePreSelect = (range: 2022 | 2023 | 2024 | 'future') => {
    if (typeof range === 'number') {
      const from = new Date(range, 0, 1);
      const to = new Date(range, 11, 31);
      setDates({ fromDate: from.toISOString(), toDate: to.toISOString() });
    } else {
      setDates({
        fromDate: new Date().toISOString(),
        toDate: MATCHING_MAX_DATE.toISOString(),
      });
    }
  };

  if (!matchArea) return <div />;

  const matchSettings: MatchSettings = {
    matchBasis: matchBasis ?? '',
    area: matchArea,
    fromDate,
    toDate,
    numTracks: 0,
  };

  return (
    <Paper
      sx={{
        width: '100%',
        '@media (min-width: 800px)': {
          maxWidth: '1000px',
          justifyContent: 'space-between',
        },
        '@media (max-width: 799px)': { maxWidth: '460px' },
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
          <InputLabel id="choose-playlist-label">
            {t('matching.criteria_select.label')}
          </InputLabel>
          <MatchCriteriaSelect
            label={t('matching.criteria_select.label')}
            value={matchSettings.matchBasis}
            onChange={onMatchBasisChange}
            hasTopArtists={hasTopArtists}
            hasSavedTracks={hasSavedTracks}
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
          <InputLabel id="choose-countries-label">
            {t('matching.area_select.label')}
          </InputLabel>
          <AreaSelect
            label={t('matching.area_select.label')}
            value={matchSettings.area.isoCode}
            onChange={onAreaChange}
            continents={continents}
            countries={countries}
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
            label={t('matching.date_select_from.label')}
            value={new Date(matchSettings.fromDate)}
            onChange={onFromDateChange}
          />
        </Grid>
        <Grid container justifyContent="space-around" sx={{ mb: 0.5 }}>
          <SettingsBarDatePicker
            label={t('matching.date_select_to.label')}
            value={new Date(matchSettings.toDate)}
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
                  {t('matching.algorithm.title')}
                </Typography>
                {t('matching.algorithm.description')}
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
      {showYearPreSelect && (
        <StyledBox sx={{ justifyContent: 'center', pb: 0.5, width: '100%' }}>
          <Button onClick={() => onDateRangePreSelect(2022)}>2022</Button>
          <Button onClick={() => onDateRangePreSelect(2023)}>2023</Button>
          <Button onClick={() => onDateRangePreSelect(2024)}>2024</Button>
          <Button onClick={() => onDateRangePreSelect('future')}>
            {t('common.future')}
          </Button>
        </StyledBox>
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
