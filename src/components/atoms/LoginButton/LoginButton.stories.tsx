import type { Meta, StoryObj } from '@storybook/react';
import LoginButton from './LoginButton';

type Story = StoryObj<typeof LoginButton>;

const meta: Meta<typeof LoginButton> = {
  title: 'Atoms/Buttons/LoginButton',
  component: LoginButton,
  parameters: {
    docs: {
      description: {
        component:
          'LoginButton used on LoginPage. Adjust screen size to see the mobile/desktop version of the button',
      },
    },
    backgrounds: {
      default: 'light',
    },
  },
};

export default meta;

export const Primary: Story = {};
