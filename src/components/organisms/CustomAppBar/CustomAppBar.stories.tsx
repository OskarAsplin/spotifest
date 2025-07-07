import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomAppBar } from './CustomAppBar';
import Stromae_Spotify_Img from '@src/storyAssets/stromae_spotify.jpeg';
import { Input } from '@src/components/ui/input';

type Story = StoryObj<typeof CustomAppBar>;

const meta: Meta<typeof CustomAppBar> = {
  title: 'Organisms/CustomAppBar',
  component: CustomAppBar,
  parameters: {
    docs: {
      description: {
        component: 'CustomAppBar displays a customized MUI AppBar',
      },
    },
    layout: 'fullscreen',
  },
  args: {
    SearchFieldComponent: () => <Input placeholder="Search" />,
    userInfo: {
      id: '1337',
      country: 'NO',
      displayName: 'Stromae',
      profilePictureUrl: Stromae_Spotify_Img,
      spotifyUrl: 'https://open.spotify.com/artist/1337',
    },
  },
};

export default meta;

export const Primary: Story = {};
export const CustomAppBarNoProfilePicture: Story = {
  args: {
    userInfo: {
      id: '1337',
      country: 'NO',
      displayName: 'Stromae',
      profilePictureUrl: undefined,
      spotifyUrl: 'https://open.spotify.com/artist/1337',
    },
  },
};
