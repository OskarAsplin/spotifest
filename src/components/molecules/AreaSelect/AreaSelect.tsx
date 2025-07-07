import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { Area } from '@src/api/types';
import { displayedLocationName } from '@src/utils/displayUtils';
import {
  europeanRegions,
  usRegions,
  WORLDWIDE_AREA,
} from '@src/utils/regionUtils';
import { useMemo } from 'react';

interface AreaSelectProps {
  continents: Area[];
  countries: Area[];
  value?: string;
  onValueChange: (area: Area) => void;
  placeholder?: string;
}

export const AreaSelect = ({
  continents,
  countries,
  value,
  onValueChange,
  placeholder = 'Select area',
}: AreaSelectProps) => {
  const allAreas = useMemo(
    () => [
      WORLDWIDE_AREA,
      ...continents,
      ...countries,
      ...europeanRegions,
      ...usRegions,
    ],
    [continents, countries],
  );

  const handleValueChange = (newValue: string) => {
    const area = allAreas.find((area) => area.isoCode === newValue);
    if (area) {
      onValueChange(area);
    }
  };
  const { t } = useTranslation();
  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full max-w-[400px] min-w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={WORLDWIDE_AREA.isoCode}>
          {WORLDWIDE_AREA.name}
        </SelectItem>

        <SelectGroup>
          <SelectLabel>
            {t('matching.area_select.continents_sub_header')}
          </SelectLabel>
          {[...continents]
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((continent) => (
              <SelectItem key={continent.isoCode} value={continent.isoCode}>
                {continent.name}
              </SelectItem>
            ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>
            {t('matching.area_select.europe_sub_header')}
          </SelectLabel>
          {europeanRegions.map((region) => (
            <SelectItem key={region.isoCode} value={region.isoCode}>
              {region.name}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>{t('matching.area_select.us_sub_header')}</SelectLabel>
          {usRegions.map((region) => (
            <SelectItem key={region.isoCode} value={region.isoCode}>
              {region.name}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>
            {t('matching.area_select.countries_sub_header')}
          </SelectLabel>
          {[...countries]
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((country) => (
              <SelectItem key={country.isoCode} value={country.isoCode}>
                <div className="flex items-center">
                  <ReactCountryFlag
                    countryCode={country.isoCode}
                    svg
                    className="mr-2 h-4 w-6"
                  />
                  {displayedLocationName(country.name)}
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
