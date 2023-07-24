import type { Meta, StoryObj } from '@storybook/react';
import ArtistBubble from './ArtistBubble';
import { artistMock } from './ArtistBubble.fixtures';

type Story = StoryObj<typeof ArtistBubble>;

const meta: Meta<typeof ArtistBubble> = {
  title: 'Molecules/ArtistBubble',
  component: ArtistBubble,
  parameters: {
    docs: {
      description: {
        component:
          'ArtistBubble displays the artist picture in a clickable Avatar',
      },
    },
  },
  args: {
    artist: artistMock,
  },
};

export default meta;

export const Primary: Story = {};
export const WithoutSpotifyId: Story = {
  args: {
    artist: { ...artistMock, spotifyId: undefined },
  },
  parameters: {
    docs: {
      description: {
        story: 'Without spotifyId it will be disabled for clicks',
      },
    },
  },
};
export const WithoutIconPicture: Story = {
  args: {
    artist: { ...artistMock, iconPicture: undefined },
  },
  parameters: {
    docs: {
      description: {
        story: 'Without icon picture it will display the MUI note icon',
      },
    },
  },
};
