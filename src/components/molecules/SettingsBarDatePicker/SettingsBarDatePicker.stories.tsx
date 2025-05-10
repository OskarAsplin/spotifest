import { Grid } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import SettingsBarDatePicker from './SettingsBarDatePicker';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

type Story = StoryObj<typeof SettingsBarDatePicker>;

const meta: Meta<typeof SettingsBarDatePicker> = {
  title: 'Molecules/SettingsBarDatePicker',
  component: SettingsBarDatePicker,
  parameters: {
    docs: {
      description: {
        component: 'SettingsBarDatePicker displays a customized MUI DatePicker',
      },
    },
  },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
  },
};

export default meta;

const Template: Story['render'] = (args) => {
  const [date, setDate] = useState(dayjs('2023-01-01'));
  const onChange = (date: Dayjs | null) => {
    if (date) setDate(date);
  };
  return (
    <Grid container justifyContent="space-around">
      <SettingsBarDatePicker {...args} value={date} onChange={onChange} />
    </Grid>
  );
};

export const Primary: Story = { render: Template };
