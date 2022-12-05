import { ComponentMeta, ComponentStory } from '@storybook/react';
import AreaSelect from './AreaSelect';
import { FormControl, InputLabel } from '@mui/material';

type Meta = ComponentMeta<typeof AreaSelect>;
type Story = ComponentStory<typeof AreaSelect>;

const meta: Meta = {
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
    continents: [
      { name: 'Europe', isoCode: 'EU' },
      { name: 'North America', isoCode: 'NA' },
      { name: 'Oceania', isoCode: 'OC' },
      { name: 'Asia', isoCode: 'AS' },
      { name: 'South America', isoCode: 'SA' },
      { name: 'Africa', isoCode: 'AF' },
    ],
    countries: [{ name: 'Norway', isoCode: 'NO' }],
    label: 'Area',
  },
};

export default meta;

const Template: Story = (args) => (
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

export { Template as AreaSelect };
