import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
  },
  argTypes: {
    onClickLogout: { control: false },
  },
};

export default meta;

const Template: Story['render'] = (args) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  return (
    <>
      <button onClick={handleClick}>Open Popover</button>
      <ProfilePopover
        {...args}
        id={popoverId}
        anchorEl={anchorEl}
        open={popoverOpen}
        onClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export const Primary: Story = { render: Template };
export const NoUserName: Story = {
  render: Template,
  args: { userName: undefined },
};
export const NoSpotifyUrl: Story = {
  render: Template,
  args: { spotifyUrl: undefined },
  parameters: {
    docs: {
      description: {
        story: 'Without spotifyUrl. Displays a link to login page',
      },
    },
  },
};
