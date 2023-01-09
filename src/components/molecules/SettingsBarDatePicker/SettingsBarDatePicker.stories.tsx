import { Grid } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SettingsBarDatePicker from './SettingsBarDatePicker';
import { useState } from 'react';

type Meta = ComponentMeta<typeof SettingsBarDatePicker>;
type Story = ComponentStory<typeof SettingsBarDatePicker>;

const meta: Meta = {
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

const Template: Story = (args) => {
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

export { Template as SettingsBarDatePicker };
