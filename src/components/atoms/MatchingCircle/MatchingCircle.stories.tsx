import { ComponentStory, ComponentMeta } from '@storybook/react';
import MatchingCircle from './MatchingCircle';

type Meta = ComponentMeta<typeof MatchingCircle>;
type Story = ComponentStory<typeof MatchingCircle>;

const meta: Meta = {
  title: 'Other/MatchingCircle',
  component: MatchingCircle,
  parameters: {
    docs: {
      description: {
        component: 'MatchingCircle used on FestivalMatchCard',
      },
    },
  },
  args: {
    matchingPercent: 83,
  },
};

export default meta;

const Template: Story = (args) => <MatchingCircle {...args} />;

export { Template as MatchingCircle };
