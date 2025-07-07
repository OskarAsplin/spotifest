import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaSelect } from './AreaSelect';
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
  },
};

export default meta;

const Template: Story['render'] = (args) => (
  <div className="w-full">
    <label
      htmlFor="choose-countries-label"
      className="mb-1 block text-sm font-medium"
    >
      Area
    </label>
    <AreaSelect {...args} />
  </div>
);

export const Primary: Story = { render: Template };
