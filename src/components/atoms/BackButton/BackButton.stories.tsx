import type { Meta, StoryObj } from '@storybook/react';
import BackButton from './BackButton';

type Story = StoryObj<typeof BackButton>;

const meta: Meta<typeof BackButton> = {
  title: 'Atoms/Buttons/BackButton',
  component: BackButton,
  parameters: {
    docs: {
      description: {
        component: 'BackButton used for returning to previous page',
      },
    },
  },
};

export default meta;

export const Primary: Story = {};
