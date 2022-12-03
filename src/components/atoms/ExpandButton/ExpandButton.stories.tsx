import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import ExpandButton from './ExpandButton';

type Meta = ComponentMeta<typeof ExpandButton>;
type Story = ComponentStory<typeof ExpandButton>;

const meta: Meta = {
  title: 'Atoms/Buttons/ExpandButton',
  component: ExpandButton,
};

export default meta;

const Template: Story = () => {
  const [expanded, setExpanded] = useState(false);
  const onChange = () => setExpanded(!expanded);
  return <ExpandButton expanded={expanded} onClick={onChange} />;
};

export { Template as ExpandButton };
