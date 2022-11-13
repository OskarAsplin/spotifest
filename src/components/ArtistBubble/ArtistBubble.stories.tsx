import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ArtistBubble from './ArtistBubble';
import Stromae_Spotify_Img from '../../storyAssets/stromae_spotify.jpeg';

type Meta = ComponentMeta<typeof ArtistBubble>;
type Story = ComponentStory<typeof ArtistBubble>;

const meta: Meta = {
  title: 'Other/ArtistBubble',
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
    artist: {
      name: 'Stromae',
      spotifyId: '5j4HeCoUlzhfWtjAfM1acR',
      iconPicture: Stromae_Spotify_Img,
      popularity: 1337,
      genres: ['belgian pop', 'g-house'],
    },
    onClick: action('onClick'),
  },
};

export default meta;

const Template: Story = (args) => <ArtistBubble {...args} />;

export { Template as ArtistBubble };
