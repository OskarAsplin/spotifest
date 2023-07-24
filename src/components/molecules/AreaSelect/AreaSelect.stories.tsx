import type { Meta, StoryObj } from '@storybook/react';
import { FormControl, InputLabel } from '@mui/material';
import AreaSelect from './AreaSelect';
import { continentsMock, countriesMock } from './AreaSelect.fixtures';

type Story = StoryObj<typeof AreaSelect>;

const meta: Meta<typeof AreaSelect> = {
  title: 'Molecules/AreaSelect',
  component: AreaSelect,
  parameters: {
    docs: {
      description: {
        component:
          'AreaSelect displays the list of available areas. It takes a list of continents and countries as arguments. \
          The European and US regions are hardcoded in the component',
      },
    },
  },
  args: {
    continents: continentsMock,
    countries: countriesMock,
    label: 'Area',
  },
};

export default meta;

const Template: Story['render'] = (args) => (
  <FormControl
    sx={{
      m: 1,
      '@media (min-width: 800px)': { minWidth: 150, maxWidth: 180 },
      '@media (max-width: 799px)': { width: '100%' },
    }}
    size="small"
  >
    <InputLabel id="choose-countries-label">{args.label}</InputLabel>
    <AreaSelect {...args} />
  </FormControl>
);

export const Primary: Story = { render: Template };
