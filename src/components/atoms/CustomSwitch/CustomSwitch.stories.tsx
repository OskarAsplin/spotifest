import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CustomSwitch } from './CustomSwitch';

type Story = StoryObj<typeof CustomSwitch>;

const meta: Meta<typeof CustomSwitch> = {
  title: 'Atoms/CustomSwitch',
  component: CustomSwitch,
  args: {
    leftOptionText: 'Popularity',
    rightOptionText: 'Alphabetically',
  },
  argTypes: {
    checked: { control: false },
    setChecked: { control: false },
  },
};

export default meta;

const Template: Story['render'] = (args) => {
  const [checked, setChecked] = useState(false);
  return <CustomSwitch {...args} checked={checked} setChecked={setChecked} />;
};

export const Primary: Story = { render: Template };
