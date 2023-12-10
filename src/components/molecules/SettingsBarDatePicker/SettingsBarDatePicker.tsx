import { outlinedInputClasses } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  MobileDatePicker,
  MobileDatePickerProps,
} from '@mui/x-date-pickers/MobileDatePicker';
import { MATCHING_MAX_DATE, MATCHING_MIN_DATE } from '../../../config';

const SettingsBarDatePicker = (
  props: Omit<MobileDatePickerProps<Date>, 'renderInput'>,
) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        {...props}
        minDate={MATCHING_MIN_DATE}
        maxDate={MATCHING_MAX_DATE}
        views={['month', 'year']}
        slotProps={{
          textField: {
            margin: 'dense',
            size: 'small',
            sx: {
              '@media (min-width: 800px)': { mr: 0.5, ml: 1 },
              '@media (max-width: 799px)': { mx: 1 },
              [`& .${outlinedInputClasses.input}`]: { cursor: 'pointer' },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default SettingsBarDatePicker;
