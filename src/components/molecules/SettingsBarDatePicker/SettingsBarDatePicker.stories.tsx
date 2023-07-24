import { Grid } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import SettingsBarDatePicker from './SettingsBarDatePicker';
import { useState } from 'react';

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
  const [date, setDate] = useState(new Date(2023, 0, 1));
  const onChange = (date: Date | null) => {
    if (date) setDate(date);
  };
  return (
    <Grid container justifyContent="space-around">
      <SettingsBarDatePicker {...args} value={date} onChange={onChange} />
    </Grid>
  );
};

export const Primary: Story = { render: Template };
