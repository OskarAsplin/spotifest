import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateRangePicker } from './DateRangePicker';
import { useState } from 'react';
import { Dayjs } from 'dayjs';
import { INITIAL_FROM_DATE, INITIAL_TO_DATE } from '@src/config';

type Story = StoryObj<typeof DateRangePicker>;

const meta: Meta<typeof DateRangePicker> = {
  title: 'Molecules/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component: 'DateRangePicker displays a customized shadcn DatePicker',
      },
    },
  },
  argTypes: {
    fromValue: { control: false },
    toValue: { control: false },
    onRangeChange: { control: false },
  },
};

export default meta;

const Template: Story['render'] = (args) => {
  const [fromDate, setFromDate] = useState(INITIAL_FROM_DATE);
  const [toDate, setToDate] = useState(INITIAL_TO_DATE);
  const onRangeChange = (from: Dayjs, to: Dayjs) => {
    setFromDate(from);
    setToDate(to);
  };

  return (
    <DateRangePicker
      {...args}
      fromValue={fromDate}
      toValue={toDate}
      onRangeChange={onRangeChange}
    />
  );
};

export const Primary: Story = { render: Template };
