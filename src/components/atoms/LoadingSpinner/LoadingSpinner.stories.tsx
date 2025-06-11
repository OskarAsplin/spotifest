import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from './LoadingSpinner';

type Story = StoryObj<typeof LoadingSpinner>;

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Atoms/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    docs: {
      description: {
        component: 'LoadingSpinner to indicate loading state',
      },
    },
  },
};

export default meta;

export const Primary: Story = {};
