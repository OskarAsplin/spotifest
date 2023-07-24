import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ExpandButton from './ExpandButton';

type Story = StoryObj<typeof ExpandButton>;

const meta: Meta<typeof ExpandButton> = {
  title: 'Atoms/Buttons/ExpandButton',
  component: ExpandButton,
};

export default meta;

const Template: Story['render'] = () => {
  const [expanded, setExpanded] = useState(false);
  const onChange = () => setExpanded(!expanded);
  return <ExpandButton expanded={expanded} onClick={onChange} />;
};

export const Primary: Story = { render: Template };
