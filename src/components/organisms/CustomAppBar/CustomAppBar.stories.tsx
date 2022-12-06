import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CustomAppBar from './CustomAppBar';
import SearchField from '../../molecules/SearchField/SearchField';
import Stromae_Spotify_Img from '../../../storyAssets/stromae_spotify.jpeg';
import { setStoryDescription } from '../../../utils/storyUtils';

type Meta = ComponentMeta<typeof CustomAppBar>;
type Story = ComponentStory<typeof CustomAppBar>;

const meta: Meta = {
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
    onClickLogo: action('onClickLogo'),
    onClickProfilePicture: action('onClickProfilePicture'),
    onClickMenu: action('onClickMenu'),
    profilePictureUrl: Stromae_Spotify_Img,
  },
};

export default meta;

const Template: Story = (args) => <CustomAppBar {...args} />;

export { Template as CustomAppBar };
export const CustomAppBarNoProfilePicture = Template.bind({});

CustomAppBarNoProfilePicture.args = { profilePictureUrl: undefined };
setStoryDescription(CustomAppBarNoProfilePicture, 'Without profilePictureUrl');
