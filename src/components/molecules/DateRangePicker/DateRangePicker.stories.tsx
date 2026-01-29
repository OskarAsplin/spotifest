import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateRangePicker } from './DateRangePicker';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

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

const Template: Story['render'] = (
  args: React.ComponentProps<typeof DateRangePicker>,
) => {
  const [fromDate, setFromDate] = useState(dayjs('2026-01-01'));
  const [toDate, setToDate] = useState(dayjs('2026-12-31'));
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
