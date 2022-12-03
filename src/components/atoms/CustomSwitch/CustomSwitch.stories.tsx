import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import CustomSwitch from './CustomSwitch';

type Meta = ComponentMeta<typeof CustomSwitch>;
type Story = ComponentStory<typeof CustomSwitch>;

const meta: Meta = {
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

const Template: Story = (args) => {
  const [checked, setChecked] = useState(false);
  return <CustomSwitch {...args} checked={checked} setChecked={setChecked} />;
};

export { Template as CustomSwitch };
