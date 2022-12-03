import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ArtistBubble from './ArtistBubble';
import { artistMock } from './ArtistBubble.fixtures';

type Meta = ComponentMeta<typeof ArtistBubble>;
type Story = ComponentStory<typeof ArtistBubble>;

const meta: Meta = {
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
    onClick: action('onClick'),
  },
};

export default meta;

const Template: Story = (args) => <ArtistBubble {...args} />;

export { Template as ArtistBubble };
