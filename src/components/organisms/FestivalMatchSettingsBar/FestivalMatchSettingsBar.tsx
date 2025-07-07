import { Button } from '@src/components/ui/button';
import { Card } from '@src/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Area, MatchSettings, Playlist } from '@src/api/types';
import { AreaSelect } from '@src/components/molecules/AreaSelect/AreaSelect';
import { MatchCriteriaSelect } from '@src/components/molecules/MatchCriteriaSelect/MatchCriteriaSelect';
import { DateRangePicker } from '@src/components/molecules/DateRangePicker/DateRangePicker';
import {
  setDates,
  setMatchArea,
  setMatchBasis,
  useMatchingStore,
} from '@src/zustand/matchingStore';
import { DATE_RANGE_YEAR_OPTIONS, MATCHING_MAX_DATE } from '@src/config';
import dayjs, { Dayjs } from 'dayjs';

interface FestivalMatchSettingsBarProps {
  matchBasis?: string;
  playlists: Playlist[];
  hasTopArtists?: boolean;
  hasSavedTracks?: boolean;
  countries: Area[];
  continents: Area[];
  isMatchBasisFieldDisabled?: boolean;
}

export const FestivalMatchSettingsBar = ({
  matchBasis,
  playlists,
  hasTopArtists = false,
  hasSavedTracks = false,
  countries,
  continents,
  isMatchBasisFieldDisabled,
}: FestivalMatchSettingsBarProps) => {
  const { t } = useTranslation();
  const matchArea = useMatchingStore((state) => state.matchArea);
  const fromDate = useMatchingStore((state) => state.fromDate);
  const toDate = useMatchingStore((state) => state.toDate);

  const onDateRangeChange = (fromDate: Dayjs, toDate: Dayjs) => {
    setDates({
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
    });
  };

  const onDateRangePreSelect = (range: number | 'future') => {
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
    <Card className="mb-4 flex w-full max-w-3xl flex-row items-center justify-between gap-2 p-2 max-sm:max-w-100 max-sm:flex-col">
      <div className="w-full">
        <label
          htmlFor="choose-playlist-label"
          className="mb-1 block text-sm font-medium"
        >
          {t('matching.criteria_select.label')}
        </label>
        <MatchCriteriaSelect
          value={matchSettings.matchBasis}
          onValueChange={setMatchBasis}
          hasTopArtists={hasTopArtists}
          hasSavedTracks={hasSavedTracks}
          playlists={playlists}
          disabled={isMatchBasisFieldDisabled}
        />
      </div>
      <div className="w-full">
        <label
          htmlFor="choose-countries-label"
          className="mb-1 block text-sm font-medium"
        >
          {t('matching.area_select.label')}
        </label>
        <AreaSelect
          value={matchSettings.area.isoCode}
          onValueChange={setMatchArea}
          continents={continents}
          countries={countries}
        />
      </div>

      <div className="w-full">
        <DateRangePicker
          label={t('matching.date_range.label')}
          fromValue={dayjs(matchSettings.fromDate)}
          toValue={dayjs(matchSettings.toDate)}
          onRangeChange={onDateRangeChange}
        />
      </div>
      <div className="flex w-full justify-between gap-2 pb-1 sm:hidden">
        {DATE_RANGE_YEAR_OPTIONS.map((year) => (
          <Button
            key={year}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDateRangePreSelect(year)}
          >
            {year}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onDateRangePreSelect('future')}
        >
          {t('common.future')}
        </Button>
      </div>
    </Card>
  );
};
