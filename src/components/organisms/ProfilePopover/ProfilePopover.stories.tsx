import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfilePopover } from './ProfilePopover';

type Story = StoryObj<typeof ProfilePopover>;

const meta: Meta<typeof ProfilePopover> = {
  title: 'Organisms/ProfilePopover',
  component: ProfilePopover,
  parameters: {
    docs: {
      description: {
        component:
          'ProfilePopover displays a user name and shows links to view porfile in Spotify and to log out',
      },
    },
  },
  args: {
    userName: 'Mr Boombastic',
    spotifyUrl: 'https://spotify.com',
    children: <button>Open Popover</button>,
  },
  argTypes: {
    onClickLogout: { control: false },
  },
};

export default meta;

export const Primary: Story = {};
export const NoUserName: Story = {
  args: { userName: undefined },
};
export const NoSpotifyUrl: Story = {
  args: { spotifyUrl: undefined },
  parameters: {
    docs: {
      description: {
        story: 'Without spotifyUrl. Displays a link to login page',
      },
    },
  },
};
