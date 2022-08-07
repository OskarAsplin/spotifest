import { TextField, outlinedInputClasses } from '@mui/material';
import {
  MobileDatePicker,
  MobileDatePickerProps,
} from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SettingsBarDatePicker = <TInputDate,>(
  props: Omit<MobileDatePickerProps<TInputDate, Date>, 'renderInput'>
) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        {...props}
        maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
        minDate={new Date(new Date().getFullYear(), 0, 1)}
        views={['month', 'year']}
        closeOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            margin="dense"
            sx={{
              '@media (min-width: 800px)': { mr: 0.5, ml: 1 },
              '@media (max-width: 799px)': { mx: 1 },
              [`& .${outlinedInputClasses.input}`]: { cursor: 'pointer' },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default SettingsBarDatePicker;
