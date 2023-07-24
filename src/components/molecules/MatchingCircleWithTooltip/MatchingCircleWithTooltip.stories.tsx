import type { Meta, StoryObj } from '@storybook/react';
import MatchingCircleWithTooltip from './MatchingCircleWithTooltip';

type Story = StoryObj<typeof MatchingCircleWithTooltip>;

const meta: Meta<typeof MatchingCircleWithTooltip> = {
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
    total: 77,
    artists: 65,
    genres: 80,
  },
};

export default meta;

export const Primary: Story = {};
