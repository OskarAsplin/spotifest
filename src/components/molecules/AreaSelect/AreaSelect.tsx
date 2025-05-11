import { ListSubheader, MenuItem, Select, SelectProps } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { Area } from '@src/api/types';
import { displayedLocationName } from '@src/utils/displayUtils';
import { europeanRegions, usRegions } from '@src/utils/regionUtils';

export const WORLDWIDE_AREA: Area = { name: 'Worldwide', isoCode: 'XXX' };

interface AreaSelectProps<T = string> extends Omit<SelectProps<T>, 'children'> {
  continents: Area[];
  countries: Area[];
}

const AreaSelect = ({
  continents,
  countries,
  ...selectProps
}: AreaSelectProps) => {
  const { t } = useTranslation();
  return (
    <Select {...selectProps}>
      <MenuItem
        key={WORLDWIDE_AREA.isoCode}
        value={WORLDWIDE_AREA.isoCode}
        style={{ minWidth: 200 }}
      >
        {WORLDWIDE_AREA.name}
      </MenuItem>
      <ListSubheader disableSticky disableGutters>
        {t('matching.area_select.continents_sub_header')}
      </ListSubheader>
      {[...continents]
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((continent) => (
          <MenuItem
            key={continent.isoCode}
            value={continent.isoCode}
            style={{ minWidth: 200 }}
          >
            {continent.name}
          </MenuItem>
        ))}
      <ListSubheader disableSticky disableGutters>
        {t('matching.area_select.europe_sub_header')}
      </ListSubheader>
      {europeanRegions.map((region) => (
        <MenuItem key={region} value={region}>
          {region}
        </MenuItem>
      ))}
      <ListSubheader disableSticky disableGutters>
        {t('matching.area_select.us_sub_header')}
      </ListSubheader>
      {usRegions.map((region) => (
        <MenuItem key={region} value={region}>
          {region}
        </MenuItem>
      ))}
      <ListSubheader disableSticky disableGutters>
        {t('matching.area_select.countries_sub_header')}
      </ListSubheader>
      {[...countries]
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((country) => (
          <MenuItem key={country.isoCode} value={country.isoCode}>
            <ReactCountryFlag
              countryCode={country.isoCode}
              svg
              style={{ marginRight: '8px' }}
            />
            {displayedLocationName(country.name)}
          </MenuItem>
        ))}
    </Select>
  );
};

export default AreaSelect;
