import { Modal, outlinedInputClasses, TextField } from '@mui/material';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { MATCHING_MAX_DATE, MATCHING_MIN_DATE } from '@src/config';
import { grey } from '@mui/material/colors';

type Props = {
  value: Dayjs;
  onChange: (date: Dayjs | null) => void;
  label: string;
};

export const SettingsBarDatePicker = ({ value, onChange, label }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TextField
        value={value.format('MMMM YYYY')}
        label={label}
        margin="dense"
        size="small"
        sx={{
          '@media (min-width: 800px)': { mr: 0.5, ml: 1 },
          '@media (max-width: 799px)': { mx: 1 },
          [`& .${outlinedInputClasses.input}`]: { cursor: 'pointer' },
        }}
        slotProps={{ input: { readOnly: true } }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(true)}
      />
      {open && (
        <DatePickerModal
          value={value}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

type DatePickerModalProps = {
  value: Dayjs;
  onChange: (date: Dayjs | null) => void;
  onClose: () => void;
};

const DatePickerModal = ({
  value,
  onChange,
  onClose,
}: DatePickerModalProps) => {
  const [newValue, setNewValue] = useState(value);

  const setValueAndClose = () => {
    if (!value.isSame(newValue)) onChange(newValue);
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Enter') setValueAndClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <Modal
      open
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
      }}
      onClose={setValueAndClose}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          value={newValue}
          onChange={(val) => val && setNewValue(val)}
          minDate={MATCHING_MIN_DATE}
          maxDate={MATCHING_MAX_DATE}
          views={['month', 'year']}
          onAccept={setValueAndClose}
          onYearChange={setValueAndClose}
          onClose={setValueAndClose}
          sx={{
            backgroundColor: ({ palette }) =>
              palette.mode === 'dark' ? grey[800] : grey[100],
          }}
          slotProps={{ actionBar: () => ({ actions: ['accept'] }) }}
        />
      </LocalizationProvider>
    </Modal>
  );
};
