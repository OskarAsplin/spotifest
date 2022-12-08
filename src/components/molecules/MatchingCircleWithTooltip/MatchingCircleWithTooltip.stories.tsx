import { ComponentMeta, ComponentStory } from '@storybook/react';
import MatchingCircleWithTooltip from './MatchingCircleWithTooltip';

type Meta = ComponentMeta<typeof MatchingCircleWithTooltip>;
type Story = ComponentStory<typeof MatchingCircleWithTooltip>;

const meta: Meta = {
  title: 'Molecules/MatchingCircleWithTooltip',
  component: MatchingCircleWithTooltip,
  parameters: {
    docs: {
      description: {
        component:
          'MatchingCircleWithTooltip shows the MatchingCircle of the `total` with a tooltip stating all three matching percentages',
      },
    },
  },
  args: {
    total: 99,
    artists: 88,
    genres: 77,
  },
};

export default meta;

const Template: Story = (args) => <MatchingCircleWithTooltip {...args} />;

export { Template as MatchingCircleWithTooltip };
