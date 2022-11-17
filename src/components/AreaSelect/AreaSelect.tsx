import { MenuItem, Select, ListSubheader, SelectProps } from '@mui/material';
import { Area } from '../../redux/types';
import ReactCountryFlag from 'react-country-flag';
import { displayedLocationName } from '../../utils/utils';
import { europeanRegions, usRegions } from '../../utils/regionUtils';

interface AreaSelectProps<T = string> extends Omit<SelectProps<T>, 'children'> {
  continents: Area[];
  countries: Area[];
}

const AreaSelect = ({
  continents,
  countries,
  ...selectProps
}: AreaSelectProps) => {
  return (
    <Select {...selectProps}>
      <MenuItem key={'XXX'} value={'XXX'} style={{ minWidth: 200 }}>
        Worldwide
      </MenuItem>
      <ListSubheader disableSticky disableGutters>
        Continents
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
        European regions
      </ListSubheader>
      {europeanRegions.map((region) => (
        <MenuItem key={region} value={region}>
          {region}
        </MenuItem>
      ))}
      <ListSubheader disableSticky disableGutters>
        US regions
      </ListSubheader>
      {usRegions.map((region) => (
        <MenuItem key={region} value={region}>
          {region}
        </MenuItem>
      ))}
      <ListSubheader disableSticky disableGutters>
        Countries
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
