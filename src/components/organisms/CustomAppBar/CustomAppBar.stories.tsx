import type { Meta, StoryObj } from '@storybook/react';
import CustomAppBar from './CustomAppBar';
import SearchField from '@src/components/molecules/SearchField/SearchField';
import Stromae_Spotify_Img from '@src/storyAssets/stromae_spotify.jpeg';

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
    SearchFieldComponent: () => <SearchField />,
    profilePictureUrl: Stromae_Spotify_Img,
  },
};

export default meta;

export const Primary: Story = {};
export const CustomAppBarNoProfilePicture: Story = {
  args: { profilePictureUrl: undefined },
};
