import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { MonthRangePicker } from '@src/components/ui/monthrangepicker';
import { Dialog, DialogContent } from '@src/components/ui/dialog';
import { Input } from '@src/components/ui/input';
import { cn } from '@src/lib/utils';
import { MATCHING_MAX_DATE, MATCHING_MIN_DATE } from '@src/config';
import dayjs from 'dayjs';

type DateRangePickerProps = {
  fromValue: Dayjs;
  toValue: Dayjs;
  onRangeChange: (fromDate: Dayjs, toDate: Dayjs) => void;
  label: string;
  className?: string;
};

export const DateRangePicker = ({
  fromValue,
  toValue,
  onRangeChange,
  label,
  className,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cn('relative', className)}>
        <label className="mb-1 block text-sm font-medium">{label}</label>
        <Input
          value={`${fromValue.format('MMM YYYY')} - ${toValue.format('MMM YYYY')}`}
          readOnly
          className="dark:hover:bg-input/50 min-w-[180px] cursor-default"
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
};

type DateRangePickerModalProps = {
  fromValue: Dayjs;
  toValue: Dayjs;
  onRangeChange: (fromDate: Dayjs, toDate: Dayjs) => void;
  onClose: () => void;
};

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
      <DialogContent className="w-auto max-w-[95vw] p-0 md:max-w-none md:min-w-[424px] [&>button]:hidden">
        <MonthRangePicker
          selectedMonthRange={{
            start: fromValue.toDate(),
            end: toValue.toDate(),
          }}
          onMonthRangeSelect={handleRangeSelect}
          minDate={MATCHING_MIN_DATE.toDate()}
          maxDate={MATCHING_MAX_DATE.toDate()}
          showQuickSelectors={false}
        />
      </DialogContent>
    </Dialog>
  );
};
