import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandardLink } from './StandardLink';

type Story = StoryObj<typeof StandardLink>;

const meta: Meta<typeof StandardLink> = {
  title: 'Atoms/StandardLink',
  component: StandardLink,
  args: {
    children: 'Link text',
  },
};

export default meta;

export const Primary: Story = {};
