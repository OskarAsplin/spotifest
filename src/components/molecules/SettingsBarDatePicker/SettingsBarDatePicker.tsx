import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { MonthRangePicker } from '@src/components/ui/monthrangepicker';
import { Dialog, DialogContent } from '@src/components/ui/dialog';
import { Input } from '@src/components/ui/input';
import { cn } from '@src/lib/utils';
import { MATCHING_MAX_DATE, MATCHING_MIN_DATE } from '@src/config';
import dayjs from 'dayjs';

// Legacy single date picker props for backward compatibility
type SingleDateProps = {
  value: Dayjs;
  onChange: (date: Dayjs | null) => void;
  label: string;
};

// New date range picker props
type DateRangeProps = {
  fromValue: Dayjs;
  toValue: Dayjs;
  onRangeChange: (fromDate: Dayjs, toDate: Dayjs) => void;
  label: string;
};

type Props = SingleDateProps | DateRangeProps;

// Type guard to check if props are for range picker
const isDateRangeProps = (props: Props): props is DateRangeProps => {
  return 'fromValue' in props && 'toValue' in props;
};

export const SettingsBarDatePicker = (props: Props) => {
  const [open, setOpen] = useState(false);

  if (isDateRangeProps(props)) {
    // Range picker mode
    const { fromValue, toValue, onRangeChange, label } = props;
    
    return (
      <>
        <div
          className={cn(
            'relative',
            'min-[800px]:mr-0.5 min-[800px]:ml-1',
            'max-[799px]:mx-1'
          )}
        >
          <label className="mb-1 block text-sm font-medium">{label}</label>
          <Input
            value={`${fromValue.format('MMM YYYY')} - ${toValue.format('MMM YYYY')}`}
            readOnly
            className="cursor-pointer min-w-[180px]"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpen(true)}
          />
        </div>
        {open && (
          <DateRangePickerModal
            fromValue={fromValue}
            toValue={toValue}
            onRangeChange={onRangeChange}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  } else {
    // Single date picker mode (legacy)
    const { value, onChange, label } = props;
    
    return (
      <>
        <div
          className={cn(
            'relative',
            'min-[800px]:mr-0.5 min-[800px]:ml-1',
            'max-[799px]:mx-1'
          )}
        >
          <label className="mb-1 block text-sm font-medium">{label}</label>
          <Input
            value={value.format('MMMM YYYY')}
            readOnly
            className="cursor-pointer"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpen(true)}
          />
        </div>
        {open && (
          <SingleDatePickerModal
            value={value}
            onChange={onChange}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }
};

// Single date picker modal props
type SingleDatePickerModalProps = {
  value: Dayjs;
  onChange: (date: Dayjs | null) => void;
  onClose: () => void;
};

// Date range picker modal props
type DateRangePickerModalProps = {
  fromValue: Dayjs;
  toValue: Dayjs;
  onRangeChange: (fromDate: Dayjs, toDate: Dayjs) => void;
  onClose: () => void;
};

// Single date picker modal (legacy)
const SingleDatePickerModal = ({
  value,
  onChange,
  onClose,
}: SingleDatePickerModalProps) => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const handleRangeSelect = ({ start }: { start: Date; end: Date }) => {
    // For single date picker, use the start date
    const newDayjs = dayjs(start);
    onChange(newDayjs);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-auto p-0">
        <MonthRangePicker
          selectedMonthRange={{ start: value.toDate(), end: value.toDate() }}
          onMonthRangeSelect={handleRangeSelect}
          minDate={MATCHING_MIN_DATE.toDate()}
          maxDate={MATCHING_MAX_DATE.toDate()}
          showQuickSelectors={false}
        />
      </DialogContent>
    </Dialog>
  );
};

// Date range picker modal
const DateRangePickerModal = ({
  fromValue,
  toValue,
  onRangeChange,
  onClose,
}: DateRangePickerModalProps) => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const handleRangeSelect = ({ start, end }: { start: Date; end: Date }) => {
    const fromDayjs = dayjs(start);
    const toDayjs = dayjs(end);
    onRangeChange(fromDayjs, toDayjs);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-auto p-0">
        <MonthRangePicker
          selectedMonthRange={{ start: fromValue.toDate(), end: toValue.toDate() }}
          onMonthRangeSelect={handleRangeSelect}
          minDate={MATCHING_MIN_DATE.toDate()}
          maxDate={MATCHING_MAX_DATE.toDate()}
          showQuickSelectors={true}
        />
      </DialogContent>
    </Dialog>
  );
};
