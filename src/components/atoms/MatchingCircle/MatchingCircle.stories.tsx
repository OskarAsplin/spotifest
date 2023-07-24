import type { Meta, StoryObj } from '@storybook/react';
import MatchingCircle from './MatchingCircle';

type Story = StoryObj<typeof MatchingCircle>;

const meta: Meta<typeof MatchingCircle> = {
  title: 'Atoms/MatchingCircle',
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

export const Primary: Story = {};
