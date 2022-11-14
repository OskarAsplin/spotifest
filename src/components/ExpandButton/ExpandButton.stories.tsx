import { ComponentStory, ComponentMeta } from '@storybook/react';
import ExpandButton from './ExpandButton';
import { useState } from 'react';

type Meta = ComponentMeta<typeof ExpandButton>;
type Story = ComponentStory<typeof ExpandButton>;

const meta: Meta = {
  title: 'Buttons/ExpandButton',
  component: ExpandButton,
};

export default meta;

const Template: Story = () => {
  const [expanded, setExpanded] = useState(false);
  const onChange = () => setExpanded(!expanded);
  return <ExpandButton expanded={expanded} onClick={onChange} />;
};

export { Template as ExpandButton };
