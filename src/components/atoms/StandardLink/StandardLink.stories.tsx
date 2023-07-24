import type { Meta, StoryObj } from '@storybook/react';
import StandardLink from './StandardLink';

type Story = StoryObj<typeof StandardLink>;

const meta: Meta<typeof StandardLink> = {
  title: 'Atoms/StandardLink',
  component: StandardLink,
  parameters: {
    docs: {
      description: {
        component:
          'StandardLink which renders as a RouteLink when `to` is given and as a normal link otherwise',
      },
    },
  },
  args: {
    children: 'Link text',
  },
};

export default meta;

export const Primary: Story = {};
